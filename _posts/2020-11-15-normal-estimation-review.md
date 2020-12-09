---
layout: distill
title: Surface Normal Estimation in Point Clouds
description: A survey on surface normal estimation in 3D point clouds
keywords: surface normal, normal estimation, 3d normal, point cloud, pcpnet, nestinet, local plane constraint, graph based normal estimation, point cloud normal estimation, pca, surface fitting
date: 2020-11-15 00:00:00-0000
author: Pratulya Bubna
comments: true
bibliography: 2020-11-15-normal-estimation-review.bib
og_image: /assets/img/blog/normal-estimation/traditional.gif

---
## Surface Normals
Have you ever encountered a semi-rendered object in a game? Perhaps in a game you were able to see through inside a box, even though from outside it seemed a solid object? Well, that happens sometimes because of rendering tricks that gaming engines use.

This usually is the case as, intuitively enough, polygon surfaces that aren't facing the camera, are not rendered; thereby, providing speed-ups in generating frames. Moreover, the saved computation resources can be spent optimizing the visible surfaces.

What determines a surface's orientation is a normal to it at a point. In 3D computer graphics, it is of great utility to determine a surface's orientation towards a light source. This piece of information helps in performing lighting computations, _eg. shading_ and achieving other visual effects. 

<blockquote>
  A normal to a surface at point P is a vector perpendicular to the tangent plane of the surface at P (see below-left image)
</blockquote>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/1.png">
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/2.png">
    </div>
</div>
<div class="caption">
    Fig 1: (left) Normal to a surface at a point is same as normal to the tangent to surface at that point
    (right) Normals to a curved surface (credits: wikipedia <d-footnote><a href="https://en.wikipedia.org/wiki/Normal_(geometry)">https://en.wikipedia.org/wiki/Normal_(geometry)</a></d-footnote>)
</div>

## Normal Estimation in Point Clouds
- [Introduction](#intro)
- [Traditional Approaches](#traditional)
- [Data-Driven Approaches](#data-driven)
  - [PCPNet](#pcpnet) <d-cite key="guerrero2018pcpnet"></d-cite>
  - [Nesti-Net](#nestinet) <d-cite key="ben2019nesti"></d-cite>
  - [Local Plane Feature Constraint](#lpfc) <d-cite key="zhou2020normal"></d-cite>
  - [Graph Convolution Network (GCN) based](#gcn) <d-cite key="pistilli2020point"></d-cite>
  - Deep Iterative <d-cite key="lenssen2020deep"></d-cite>
  - Hough Transform <d-cite key="boulch2012fast"></d-cite>

<a name="intro"></a>
### Introduction

A point cloud from a dataset (say, PCPNet Dataset) represents a set of points **sampled** from an underlying surface. Inherent imperfections such as _varying sampling density, noise, missing data,_ however lie in the point cloud data.

<blockquote>
A point cloud is a set of data points in a space that represents a 3D shape or object. Each point has its set of X,Y,Z coordinates. <d-footnote><a href="https://en.wikipedia.org/wiki/Point_cloud">https://en.wikipedia.org/wiki/Point_cloud</a></d-footnote>
</blockquote>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/3.png">
    </div>
</div>
<div class="caption">
    point cloud (left) sampled from the original surface (right)
</div>

_<u>Problem Statement:</u>_  Given a point cloud, process it **directly** to infer the surface normals.<br>
Note that this problem is different from processing a point cloud _indirectly_, where it is first converted to an **intermediate** representation, _eg. mesh,_ and then processed.<br>

More closely, the problem requires us to be able to infer the underlying surface from the point cloud representation, from which the normals can be estimated at the given points. 
<blockquote>
Given a geometric surface, it’s usually trivial to infer the direction of the normal at a certain point on the surface as the vector perpendicular to the surface at that point.
</blockquote>

Making use of local surface properties such as normals and curvature as additional features for the point clouds has shown improvement in downstream tasks such as reconstruction, segmentation, denoising etc.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/issues.jpg">
    </div>
</div>
<div class="caption">
    issues inherent to point cloud data while estimating normals (credits: <d-footnote><a href="https://www.boulch.eu/files/talks/2016_sgp_normals_slides.pdf">Boulch, Alexandre et al.  "Deep Learning for Robust Normal Estimation in Unstructured Point Clouds"</a></d-footnote> )
</div>

<a name="traditional"></a>
<div class="l-body"><hr style="margin:0;"></div>

### Traditional Approaches
The traditional approaches to estimate normal at a point P involve **fitting a surface to a patch** of local neighborhood points around `P` and then calculating the normal analytically. For instance, <d-cite key="hoppe1992surface"></d-cite> utilizes PCA to fit a low-order surface on the `r-ball` neighborhood surrounding `P`, and outputs the eigenvector with minimum eigenvalue as the normal at `P`. In other words, normal at `P` is in the direction of the vector representing least variance. (PCA finds an orthogonal basis that best represents data by finding eigenvectors in directions of maximum variances.)

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/traditional.gif">
    </div>
</div>
<div class="caption">
    Fitting a surface to a patch (credits: Ben-Shabat et al. <d-cite key="ben2019nesti"></d-cite>)
</div>

Other approaches try fitting higher-order surfaces such as spherical surfaces, jets. <d-cite key="CAZALS2005121"></d-cite> There's work involving ideas from Voronio diagrams to achieve sharper results.

Given the orientation of a normal&mdash;a global property, techniques such as **Poisson Surface Reconstruction** can be used to reconstruct the mesh. However, most of the approaches tend to regress only the direction of the normal&mdash;a local property, and not the orientation. Orientation of the normals can be determined as a post-processing step though, using some approaches. **Minimum Spanning Trees (MST)** based approaches work on the intuition that parallel tangent plances in a neighborhoood should have similar normals, and thus propagate orientations using MST.




<a name="data-driven"></a>
### Data-Driven Approaches
The **fundamental problem** with the traditional approaches is the sensitivity to the choice of hyperparameters such as the _radius of the neighborhood_, for one, which leads to problematic results at the borders (corners, edges). Even though a _small_ radius might be preferred to appropriately constrain the neighborhood and output fine normal estimations, it is sensitive to outliers; thereby, leading to inaccurate estimations at the borders. On the other hand, a _large_ radius would oversmoothen (average) the estimates at these sharp features.

To overcome such tradeoffs between robustness to noise and accuracy of fine details, SOTA approaches are utilizing **data-driven methods**.

To put it into persepective, normal estimation in point clouds is a regression problem and {`L2`, `RMSE`} loss can be utilized for training the deep learning architecture.

Some common datasets include PCPNet Dataset, NYU Depth V2, ScanNet.

Now, let's look at some of the deep learning based approaches for estimating local 3D shape properties in point clouds:

<div class="l-body"><hr style="margin:0;"></div>

<!------- PCPNet ------->
<a name="pcpnet"></a>
### PCPNet <d-cite key="guerrero2018pcpnet"></d-cite>
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/pcpnet.png">
    </div>
</div>
<div class="caption">
    Single-scale and multi-scale PCPNet archicture.
</div>
- PCPNet has a PointNet <d-cite key="qi2017pointnet"></d-cite> inspired architecture.
  - computes per-point features
  - uses a **Spatial Transformer Network** (STN) to output a **Quaternion** (rotation) instead of 3x3 matrix, to convert input into a canonical pose.
- The original PointNet architecture excels in _global feature learning_ which is good for classification tasks. However, to estimate local surface properties as in our case, local-level features are suited better. Hence, PCPNet makes use of **local patches** (_neighborhood_) centered at sampled points.
  - helps in preserving features around high-curvature regions, and thus allow more robust results.
  - uses `k-dim` patch feature vectors to regress normals, curvature and/or both (in joint training)
- The **multi-scale** variant of PCPNet takes patches of varied neighborhood sizes and concatenates into a single vector to regress properties. This, in practice, works better than single-scale.
- It can output **both** _oriented_ and _unoriented_ normals, as well as _principal curvature_.

<div class="l-body"><hr style="margin:0;"></div>

<!------- Nesti-Net ------->
<a name="nestinet"></a>
### Nesti-Net <d-cite key="ben2019nesti"></d-cite>
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/nestinet.png">
    </div>
</div>
<div class="caption">
    Nesti-Net Architecture.
</div>
- Nesti-Net estimates **unoriented** normals for each point. It:
  1. computes a multi-scale representation for the points' neighborhood
  2. regresses the normal vector (Ni, Nj, Nk) using a **mixture of 3D CNN expert networks**
  3. selects the best expert using a **selection manager** and outputs its prediction
- The multi-scale representation is termed as Multi-scale Point Statistics (MuPS) which is computed by taking multi-scaled neighborhood representations and converting to `3DfMV` <d-cite key="ben20173d"></d-cite> **(fisher vectors)** representation.
  - For computing the 3DfMV <d-cite key="ben20173d"></d-cite>, a coarse Gaussian grid is laid over the neighborhood. 
  - This representation is permutation-invariant, sample-size independent and thus allows the otherwise unstructured, unordered input (point cloud) suitable for applying 3D CNN.
- The usage of _Mixture of Experts `(MoE)`_ network and a scale selection manager essentially encourages **specialization**, allowing Nesti-Net to learn the neighborhood size that minimizes the normal estimation error, rather than averaging on multi-scales.
  - It is explored what different experts learn: eg. for high curvature areas, output from expert dealing with small radius is selected.
  - The selection manager sets a dynamic behavior wherein an expert is chosen to output depending on the probability of it estimating correctly.
- Nesti-Net is `not` an end-to-end network. It involves a pre-processing step of computing MuPS features `(4D vector)` before passing to the MoE network, which involves computing Fisher Vectors using GMM.

<div class="l-body"><hr style="margin:0;"></div>

<!------- LPFC ------->
<a name="lpfc"></a>
### Local Plane Constraint and Multi-Scale Selection <d-cite key="zhou2020normal"></d-cite>
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/lpfc.png">
    </div>
</div>
<div class="caption">
    Architecture
</div>
- The paper presents **Local Plane Feature Constraint** (LPFC) mechanism to improve on the estimation of unoriented normals. The main idea of LPFC is to learn which points _really_ are part of the local patch, as opposed to the outliers or the “error points”.
- The **binary classification** mechanism uses a threshold to determine if the point really lies on the local-plane (patch) and whether it should contribute towards estimating the true normal at the center of the patch.
- It calculates `L2` distance for each of the point on the patch from the center point to determine how aligned they are with the center, and outputs 0 or 1 based on a threshold.
- This obtained **plane estimation vector** is concatenated with global feature vector of the patch to estimate the normal.
- Using **plane-aware features** obtained with LPFC allows for more robust results, as it removes the outliers (error points) from the patch (in prediction).
- Overall, instead of just using regression loss, it uses **multi-task loss** in a joint-learning fashion (classification + regression).
- Multi-scale version of this approach has also been presented.


<div class="l-body"><hr style="margin:0;"></div>

<!------- gcn-based ------->
<a name="gcn"></a>
### (Graph Convolutional Networks) GCN-based <d-cite key="pistilli2020point"></d-cite>
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/normal-estimation/gcn.png">
    </div>
</div>
<div class="caption">
    Proposed Architecture
</div>
- Utilizes GCNs to extract neighborhood representation, which tend to be based on the intuition behind the standard CNNs: weight reuse, locality, hierarchical compositionality
  - GCNs are a powerful tool to aggregate and build on local information.
- Design
  - Involves dynamic graph construction (**Edge-Conditioned Convolution** <d-cite key="simonovsky2017dynamic"></d-cite> ) which helps in accumulating global information in later layers
  - Involves **residual blocks** of GCN layers
  - Includes **edge attention** term in neighborhood aggregation update.
- Instead of estimating normals only for the central points of the patch (eg. in PCPNet), this computes normals for all the points in the patch.
- In the loss function, it takes a subset of P points from the patch to avoid estimation errors due to points far away from the center (border effects)


<hr>
:bulb: ```TODO: complete citations @me```

:loudspeaker: ```know of any other interesting architectures? discussion section is below``` [:arrow_down:](#disqus_thread)
