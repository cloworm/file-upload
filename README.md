# File Upload LWC

> The File Upload Lightning Web Component let you upload files via drag and drop or browse on any Salesforce record page in Lightning or Experience Cloud.

## Preview

![Demo](https://user-images.githubusercontent.com/5566310/109728442-303aee00-7b84-11eb-9ef4-5a2fddbbb8d3.png)

## Features

- Drag and Drop to upload files
- Assign uploaded files a ContentVersion.Type\_\_c value
- Filter files by Filename
- Optional table component to display all files on a record which can be filtered by filename
- Optional table columns: Edit, Delete, Download

## Component Properties

<!-- ![Component Properties](https://user-images.githubusercontent.com/5566310/108149925-c3165b80-70a1-11eb-9072-e8de416fc4ec.png) -->

| Property                     | Description                                                                                                            | Type                                       | Default Value |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------- |
| Record Id                    | Enter recordId if used on a Lightning Record Page or {!recordId} if used on an Experience Cloud record page (Required) | String                                     | recordId      |
| Allowed File Extensions      | Comma-separated list of file extensions that can be uploaded in the format .ext, such as .pdf, .jpg, or png.           | String                                     |               |
| Show Table Component         | Display tables of files underneath the file upload component, grouped by ContentVersion.Type\_\_c                      | Checkbox                                   | Checked       |
| Bold Filename                | Display filename in bold in table component                                                                            | Checkbox                                   |               |
| Use Delete Column in Table   | Let users delete files within the table component                                                                      | Checkbox                                   | Checked       |
| Use Edit Column in Table     | Let users delete the file Type of a file within the table component                                                    | Checkbox                                   | Checked       |
| Use Download Column in Table | Let users download files from the table component                                                                      | Checkbox                                   | Checked       |
| Badge Color                  | String (Lightning) or Color (Experience)                                                                               | Customize color of Badge                   | #ecebea       |
| Edit Icon Color              | String (Lightning) or Color (Experience)                                                                               | Customize color of Edit icon               | #706e6b       |
| Preview Icon Color           | String (Lightning) or Color (Experience)                                                                               | Customize color of Preview Icon            | #706e6b       |
| Download Icon Color          | String (Lightning) or Color (Experience)                                                                               | Customize color of Download Icon           | #706e6b       |
| Delete Icon Color            | String (Lightning) or Color (Experience)                                                                               | Customize color of Delete Icon             | #c23934       |
| Uploader Background Color    | String (Lightning) or Color (Experience)                                                                               | Customize color of uploader dropzone       | #5eb4ff       |
| Uploader Outline Color       | String (Lightning) or Color (Experience)                                                                               | Customize color of uploader dashed outline | #fafcfe       |

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

Run LWC tests

```
npm run test
```

Run Apex tests

```
npm run test:apex
```

Lint LWC

```
npm run lint
```

Deploy to a sandbox

```
sfdx force:source:deploy -p force-app/main/default -u {org-alias}
```

or, Deploy to a scratch org

```
sfdx force:source:push -p force-app/main/default -u {org-alias}
```
