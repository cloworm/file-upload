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

| Property            | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| Allowed Mime Types  | String   | Comma separated list of allowed mime types    |
| Show Grid Component | Checkbox | Display datatable of all files for the record |

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
