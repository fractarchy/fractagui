(pre-alpha version)

![](https://contrast-zone.github.io/e-fun/media/i1.svg) ![](https://contrast-zone.github.io/e-fun/media/i2.svg) ![](https://contrast-zone.github.io/e-fun/media/i3.svg)  

test a prototype here: [**https://e-teoria.github.io/e-fun/**](https://contrast-zone.github.io/e-fun/)  

# e-fun

The current version of **e-fun** represents a progressive HTML-Javascript web page system for visualizing and navigating a tree-structured elements composed of bitmap or vector graphics. **e-fun** can be used to assist content management process. Content management system (CMS) is a software application that manage the creation and modification of digital content. Using **e-fun**, the content is supposed to be collected from outer resources such are vector image or bitmap editor, while **e-fun** itself manages only browsing and navigating over tree-structured content. Content elements in a form of vector graphics (SVG) are suitable for representing illustrations, formatted textual, or tabular data. Content elements in a form of bitmaps are suitable for representing photos and other types of graphics compressed either by lossless (GIF, PNG) or lossy (JPG) methods.

## 1. purpose and restrictions

**E-fun** is optimized to visualize and navigate relatively small number of content elements (up to 50 separate page units, varying on pages size and client performance). Since **e-fun** visual interface is very processing intensive, all the graphical elements are pre-cached upon main HTML page load event. Pre-caching is used to deliver smooth and flicker-free browsing experience as much as it is possible, but it may also introduce an initial startup delay on slower machines if using a larger number of image elements.

### 1.1. possible use cases

What can fit in less than 50 pages web site? Let's overview a few examples:

- personal or business portfolio
- notice board
- items catalogue
- happenings schedule
- presentation slide show
- ...

As the list goes on, a hope emerges that **e-fun** could still find a use in some cases. But for creating an **e-fun** site, one should make sure to prepare to a "slack" experience. That means one should possess a basic knowledge about editing vector and bitmap graphics, local file system usage, and web server managing. Nevertheless, once when you get into the stunt, maintaining the site should be an easy-peasy task.

## 2. browsing the content

**E-fun** brings a simple and minimalistic kind of contents structuring and organization. All the pages are displayed inside a number of ovals that hierarchically relate between each other. Central oval is supposed to be used for reading and viewing contents, while orbiting ovals are supposed to be used for contents navigation. All the actions of browsing contents are performed by dragging displayed elements by mouse (click-drag-release cycles), or by touch screen interaction (point-drag-release cycles).

### 2.1. panning the content elements

**E-fun** implements a real time magnifyer rendering effect for displaying content that is larger than display area. The center of oval area uses a magnification factor of 1, the border area uses a magnification factor of 0, while the space in between uses a fine range between those two. Such content is no longer required to use scroll bars to focus an area of interest, yet the entire content image pane fits in an oval with a combined range of different magnification factors. User is always free to pan and focus any area of content by dragging it to the center of an oval. However, note that only the central oval accepts panning events. 

### 2.2. navigating the content structure

The structure of content in **e-fun** is visualized in a distinctive way, resembling a form of a fractal arranged ovals where child ovals orbit around each parent oval recursively. Ovals themselves store textual or image information fitting into hierarchical parent-children relations. Dragging ovals around their parents enables walking horizontally through the tree (focusing siblings), while dragging in or out of oval parents or children enables walking vertically through the hierarchical structure of data (focusing a parent or a child oval at central navigation oval).

## 3. building e-fun based site

To populate **e-fun** site with custom contents, it is necessary to prepare graphical images representing our pages, to have an access to arbitrary textual editor, and it may be good to have a local web server at disposition for testing our new site. **E-fun** represents a so-called flat file CMS, meaning there is no server database or server scripting technology setup, yet all the information needed for functioning is extracted only from file-folder structure accessed over HTTP interface.

### 3.1. making a local copy

After downloading the **e-fun** software bundle from [dedicated github pages](https://github.com/contrast-zone/e-fun), we have to unpack the downloaded archive to a local folder of our choice. Unpacking will produce the following folder-file structure:

    └─┬ orbiteque-home-folder
      ├─┬ instructions
      │ ├── i1.svg
      │ ├── i2.svg
      │ └── i3.svg
      │
      ├─┬ contents
      │ └── ... content images go here ...
      │
      ├── README.md
      ├── index.html
      ├── orbital.js
      └── contents.json 

The unpacked files reflect an example site containing these instructions we are currently reading. After unpacking, we have to modify the example site to adjust it to our requirements and introduce our own contents.

### 3.2. customizing our site

To fully customize our new **e-fun** site, first we have to prepare vector or bitmap images that will represent our pages. These images have to be copied under `contents` folder, while deleting existing example images we don't need anymore. After copying images, we have to introduce particular changes to `contents.json` file in external text editor of your choice. By default, `contents.json` is set up to display these instructions pages, and to customize it for our own images structure, it should be easy to follow the similar pattern. After modifying `contents.json` file and saving changes, our site is ready for uploading to a server of our choice.

### 3.3. testing and publishing our site

Unfortunately, it is not possible to test **e-fun** pages from a local file system due to web browsers image copyright policy. This copyright policy prevents HTML scripting engine to extract individual pixels from local images, and since **e-fun** manipulates raw pixel data, this HTML-image synergy works only over general HTTP calls that browsers consider safe regarding to copyrighting. Thus, to test the pages locally, it is necessary to install a third party web server like **Apache HTTP Server** or similar to a local computer.

When we have a local HTTP server running, all we have to do is to copy the entire modified structure from below the orbiteque-home-folder to HTTP server home folder, just to check if everything runs as it is supposed to be. If everything goes well, our new pages can be accessed in a web browser from local HTTP address.

To simplify testing, natural choice would also be keeping and modifying our site directly in local server home folder instead of some other arbitrary local folder. This would save us the step of copying site from local folder to local testing server home folder.

Finally, when we are done testing our site, to publish it to a remote online server, we copy again the entire structure from below the orbiteque-home-folder, but this time to a remote server home folder. We can usually do this by using control panel pages provided by the remote server, or via FTP if we have an access to FTP user name and password. If everything goes well, our new site would be spinning on the web.

## 4. licencing, owning a copy, and joining mailing list

- **e-fun** is shared to public under [Creative Commons Attribution-NoDerivatives 4.0 International License ![Creative Commons License](https://i.creativecommons.org/l/by-nd/4.0/80x15.png)](http://creativecommons.org/licenses/by-nd/4.0/).
- As already mentioned, a copy of **e-fun** can be downloaded from [dedicated github pages](https://github.com/contrast-zone/e-fun).
- To ask any questions about **e-fun**, to report a bug, or to track new releases, please refer to a [dedicated mailing list](https://groups.google.com/d/forum/czone-efun).

With this section, we conclude **e-fun** instructions exposure. I hope I got you interested, and I wish you a productive web knitting.
