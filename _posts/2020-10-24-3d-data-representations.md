---
layout: distill
title: 3D Data Representations
description: Learning about voxelization, point clouds, 3D meshes and implicit surfaces
keywords: 3D, 3D Data, Voxels, Voxelization, Point Cloud, Meshes, Implicit Surfaces, what is voxelization, what are voxels, voxel vs pixel
date: 2020-10-24 00:00:00-0000
author: Pratulya Bubna
comments: true
bibliography: 2020-10-24-3d-data-representations.bib
og_image: /assets/img/blog/3d-data/1.jpg

---

<div class="row row-cols-2 mt-3">
    <div class="col-sm mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/voxels.gif">
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/pointcloud.gif">
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/mesh.gif">
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/vis3d.gif">
    </div>
</div>
<div class="caption">
    (left-right) Voxel • Point Cloud • Mesh • Implicit Surface (credits <d-footnote><a href="https://autonomousvision.github.io/occupancy-networks/">Mescheder, Lars et al.: "Occupancy Networks"</a></d-footnote>)
</div>

- [Introduction](#intro)
- [Voxels](#voxel)
  - [Voxelization](#voxelization)
- [Point Clouds](#pointcloud)
- [Meshes](#mesh)
- [Implicit Surfaces](#implicit)

<!-- Introduction -->
<a name="intro"></a>
### Introduction

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/1.jpg">
    </div>
</div>
<div class="caption">
    Data Representations: 2D vs 3D (credits <d-footnote><a href="https://drive.google.com/file/d/1EL98pDXvzXAnTB4ivL2hGm3zO21GWGjm/view">Litany, Or: "Geometric Deep Learning: Introduction"</a></d-footnote>)
</div>

Unlike in 2D where we have images (array of pixels &mdash; a **grid**) as a well-defined choice of representation, there is no such consensus in case of 3D data. Different 3D data representations have varying geometric structure and properties. In this post, we'll cover some of the commonly chosen 3D representations and discuss their properties.

Needless to say, different data representations entail different datasets, different deep learning architectures and sometimes different tasks as well.



<!-- Voxel -->
<a name="voxel"></a>
<div class="l-body"><hr style="margin: 0"></div>

### Voxels
Voxels in 3D are analagous to _pixels_ in 2D. Just as pixels are basic elements on a regular 2D grid, voxels are _volumetric elements_ that make up volume in 3D space.

 <div class="row mt-3">
    <div class="col-sm-9 mt-3 mt-md-0">
      <p>Imagine a voxel as a <b>cube</b> that represents a single data point on a regularly-spaced 3D grid. Many such voxels would <em>approximate</em> a continuous 3D surface.<br><br>
      Voxels don't have their positions encoded (inferred from relative positions) and can contain multiple scalar values like density, color, opacity etc.
      </p>
    </div>
    <div class="col-sm-3 mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/voxel.png">
    </div>
</div>
<div class="caption">
    (image credits: <d-footnote><a href="https://en.wikipedia.org/wiki/Voxel">https://en.wikipedia.org/wiki/Voxel</a></d-footnote>)
</div>

- It is important to realise that voxels are `discrete` units (similar to pixels) and hence serve as an approximation to continuous surfaces. Thus it is bound to suffer from **artifacts**.
- The principle of _resolution_ follows &mdash; more the resolution, better the approximation of surfaces.
- Voxels have **cubic** memory footprint and is a **sparse** representation.
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/19.jpg">
    </div>
</div>
<div class="caption">
    (left-right) increasing resolution, increasing sparsity, decreasing occupancy (image credits <d-footnote><a href="http://3ddl.stanford.edu">Su, Hao et al.: "A Tutorial on 3D Deep Learning", CVPR 2017 (Stanford)"</a></d-footnote>)
</div> 

<a name="voxelization"></a>
### Voxelization
> Voxelization is the process of converting a geometric object from its continuous geometric representation into a set of voxels that approximate it.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/55.jpg">
    </div>
</div>
<div class="caption">
    It should be pointed that all occupied voxels (containing geometry) in the 3D grid would have value <b>1</b> and rest <b>0</b>
</div> 

#### Procedure (in layman's terms)
1. Take a huge cube and span it across the whole model you wish to approximate
2. Evenly divide into smaller cubes and repeatedly subdivide every cell **that contains geometry**
3. Stop when you’re satisfied with the level of detail of approximation

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/voxelization.png">
    </div>
</div>
<div class="caption">
    Visualization of Octree Voxelization using a 2D case (QuadTree) (credits: <d-footnote><a href="https://youtu.be/gNZtx3ijjpo">Animated sparse voxel octrees</a></d-footnote>)
</div> 



<!-- Point Cloud -->
<a name="pointcloud"></a>
<div class="l-body"><hr style="margin: 0"></div>

### Point Cloud
A point cloud is an **unordered** set of points in a space that approximates the geometry of 3D objects.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/pc.png">
    </div>
</div>
<div class="caption">
  point cloud (left) <b>sampled</b> from the original surface (right)
</div>

<div class="row mt-3">
    <div class="col-sm-6 mt-3 mt-md-0">
        A point cloud with N points will have <b>N! permutations</b> possible for its representation.<br><br>
        It does not have any inherent structure for representation and has <b>no connectivity information</b>. This creates difficulty in learning from point clouds directly as there is inherent ambiguity about the surface information. <br><br>
        Point clouds are a simple representation and are easy to capture using readily available technologies such as Kinect, LiDaR scanners etc. However, the acquired data from the environment is not always perfect (see next image). 
    </div>
    <div class="col-sm-6 mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/pc1.jpg">
    </div>
</div>
<div class="caption">
    image credits: <d-footnote><a href="https://youtu.be/PSVmTDzXPpc">Lindenbaum, Michael: "3D... Workshop, Institut Henri Poincare"</a></d-footnote>
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/pc2.png">
    </div>
</div>
<div class="caption">
  Characteristics of point cloud data (image credits: <d-footnote><a href="http://geometry.cs.ucl.ac.uk/SGP2017/slides/Alliez_SurfaceReconstruction_SGP.pdf">Alliez, Pierre: "Surface Reconstruction, SGP 2017 (UCL)"</a></d-footnote>)
</div>


<!-- Mesh -->
<a name="mesh"></a>
<div class="l-body"><hr style="margin: 0"></div>

### 3D Mesh

A 3D Mesh, or polygonal mesh, approximates surfaces via a set of 2D **polygons** in 3D space. A mesh structure consists of **faces**, a set of **vertices** (coordinates) in 3D space, and **edges** &mdash; a connectivity list that describes how the vertices are connected with each other.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/mesh.jpg">
    </div>
</div>
<div class="caption">
  (left) mesh (right) point cloud (credits: Litany, Or: "Geometric Deep Learning: Introduction")
</div>

A mesh provides an efficient, **non-uniform** representation of a shape: a small number of polygons (`coarser`) can cover large, simple surfaces; and, many higher resolution polygons (`finer`) can faithfully represent intricate, detailed geometry.

Most commonly, **triangular** meshes are used as they are non-planar, memory-efficient and can be rendered fast

<a name="implicit"></a>
<div class="l-body"><hr style="margin: 0"></div>

### Implicit Surface
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/vis2d.svg">
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/vis3d.gif">
    </div>
</div>
<div class="caption">
    (image credits: Mescheder, Lars et al.: "Occupancy Networks")
</div>

Implicit representations, eg. level sets, represent the surface as a **continuous function**. They are more expressive and are able to capture more geometrical information of 3D shapes.

`Level sets`, for instance, are equipped with mathematical formulations that permit the inclusion of geometric quantities such as surface orientation, smoothness and volume.

Park et al. in <d-cite key="park2019deepsdf"></d-cite> define implicit surface as a `Signed Distance Function` (SDF).
> An SDF is a continuous function that, for a given spatial point, outputs the point’s distance to the closest surface, whose sign encodes whether the point is inside (negative) or outside (positive) of the watertight surface. <d-cite key="park2019deepsdf"></d-cite>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/blog/3d-data/sdf.jpg">
    </div>
</div>
<div class="caption">
    Implicit surface defined as an SDF <d-cite key="park2019deepsdf"></d-cite><br>
    SDF<0 (inside) SDF>0(outside) SDF=0(on) the surface
</div>



***
:loudspeaker: ``` the discussion section is below``` [:arrow_down:](#disqus_thread) 


