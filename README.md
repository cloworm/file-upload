# File Upload LWC

> The File Upload Lightning Web Component uses the HTML Drag and Drop API to let your users upload files via drag and drop or browse on any Salesforce record page.

## Demo

![Demo](https://user-images.githubusercontent.com/5566310/108149734-73379480-70a1-11eb-96fe-1a9eb3588a83.png)

## Features

- Drag and Drop to upload files
- Configurable mimetypes
- Optional grid component to display all files on a record which can be filtered by filename

## Component Properties

<!-- ![Component Properties](https://user-images.githubusercontent.com/5566310/108149925-c3165b80-70a1-11eb-9072-e8de416fc4ec.png) -->

| Property                | Required | Type     | Default Value   |
| ----------------------- | -------- | -------- | --------------- |
| Allowed File Extensions | X        | String   | .png,.gif,.docx |
| Show Grid Component     |          | Checkbox | Checked         |

## Allowed File Types

The _Allowed File Extensions_ property should be a comma separated list of the extensions you'd like users to be able to upload with this component. Choose from the list of supported file extensions below.

Ex: .png,.gif,.docx

| Extension | Mime Type                                                                 |
| --------- | ------------------------------------------------------------------------- |
| .csv      | text/csv                                                                  |
| .doc      | application/msword                                                        |
| .docx     | application/vnd.openxmlformats-officedocument.wordprocessingml.document   |
| .dot      | application/msword                                                        |
| .ics      | text/calendar                                                             |
| .mdb      | application/vnd.ms-access                                                 |
| .pdf      | application/pdf                                                           |
| .pps      | application/vnd.ms-powerpoint                                             |
| .ppsx     | application/vnd.openxmlformats-officedocument.presentationml.slideshow    |
| .ppt      | application/vnd.ms-powerpoint                                             |
| .pptx     | application/vnd.openxmlformats-officedocument.presentationml.presentation |
| .rtf      | application/rtf                                                           |
| .sxc      | application/vnd.sun.xml.calc                                              |
| .sxi      | application/vnd.sun.xml.impress                                           |
| .sxw      | application/vnd.sun.xml.writer                                            |
| .txt      | text/plain                                                                |
| .xls      | application/vnd.ms-excel                                                  |
| .xlsx     | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet         |
| .bmp      | image/bmp                                                                 |
| .gif      | image/gif                                                                 |
| .jpeg     | image/jpeg                                                                |
| .jpg      | image/jpeg                                                                |
| .png      | image/png                                                                 |
| .tif      | image/tiff                                                                |
| .tiff     | image/tiff                                                                |
| .vsd      | application/vnd.visio                                                     |
| .mp3      | audio/mpeg                                                                |
| .ogg      | application/ogg                                                           |
| .wav      | audio/wav                                                                 |
| .mov      | video/quicktime                                                           |
| .mpeg     | video/mpeg                                                                |
| .mpg      | video/mpeg                                                                |
| .zip      | application/zip                                                           |
| .css      | text/css                                                                  |
| .htm      | text/html                                                                 |
| .html     | text/html                                                                 |
| .js       | text/javascript                                                           |
| .xml      | text/xml                                                                  |
| .xsl      | text/xsl                                                                  |
| .xslt     | application/xslt+xml                                                      |

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

## Usage

Clone project

```
git clone https://github.com/cloworm/file-upload
```

Install dependencies

```
npm i
```

Deploy to a sandbox

```
sfdx force:source:deploy -p force-app/main/default -u {org-alias}
```

or, Deploy to a scratch org

```
sfdx force:source:push -p force-app/main/default -u {org-alias}
```
