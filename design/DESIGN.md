# Software Design Document for Cell Tracking Application

## 1. Introduction
A cell tracking application is to be developed. Individual cells are to be tracked across a chronological sequence of images using traditional computer vision methods, with deep learning techniques planned for future integration. User data is expected to be provided in a folder, where images are ordered by file names (this ordering may be customized).

## 2. System Overview
The application is to be organized into modular components, which are to be maintained independently:

- **Input & File Management:**  
  Data is loaded from a folder and is ordered by file names or custom criteria.

- **Preprocessing:**  
  Image normalization is applied based on user-specified parameters, with an example image provided for adjustments.

- **Tracking:**  
  Cells are detected and tracked across images using traditional methods. Manual corrections are to be enabled.

- **Segmentation & Classification:**  
  Traditional techniques are used initially, with plans for deep learning integration in later phases.

- **Visualization:**  
  An interactive interface is provided to display tracking progress and overlays, with options to toggle paths and annotations.

- **Data Management:**  
  Annotations and metadata are stored efficiently to manage system memory.

## 3. Functional & Non-Functional Requirements
- Data is to be input and ordered by default based on file names, with an option for custom ordering.
- Image normalization parameters are to be adjustable through an example image.
- Cells are to be detected, tracked, segmented, and classified.
- A responsive and intuitive user interface is to be provided.
- Modularity, performance, and scalability are to be ensured.

## 4. Example GUI
An example GUI is to be provided as follows:

### Main Window Layout
- **Menu Bar:**  
  Options such as "File", "Settings", and "Help" are to be displayed.

- **Sidebar:**  
  A file explorer or folder selection area is to be provided for loading images.

- **Image Display Panel:**  
  The main area is to display the current image with overlays indicating tracked cells. A slider is provided at the bottom for navigating through the image sequence.

- **Control Panel:**  
  Controls for adjusting image normalization parameters are to be provided. Toggle buttons to show or hide cell tracks and annotations, and a "Run Tracker" button are to be included.

- **Status Bar:**  
  Processing progress and the current status are to be displayed.


## 5. Development Roadmap
- **Phase 1:**  
  Implementation of data input, preprocessing, and tracking using traditional methods.

- **Phase 2:**  
  Enhancement of visualization and addition of manual correction features.

- **Phase 3:**  
  Development of segmentation and classification features.

- **Phase 4:**  
  Integration of deep learning capabilities.

- **Phase 5:**  
  Optimization and refinement based on user feedback.

## 6. Summary
A modular cell tracking application is to be developed, initially relying on traditional computer vision methods with future integration of deep learning. A responsive and intuitive user interface is to be provided, and the design is to be maintained in a scalable and extensible manner.
