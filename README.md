# File Upload LWC

> File Upload LWC contains two themable Lightning Web Components that let users upload files to a record page via drag and drop and assign the created ContentVersion records a Type\_\_c value.

| Component             | Use when...                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| uploadFilesByType     | All users can view and upload files to any Type\_\_c                                                                                                         |
| uploadFilesByMetadata | Users need to be restricted on the Type\_\_c of files they can upload and view. See **Notes on using uploadFilesByMetadata** below for instructions on setup |

## Preview

![Demo](https://user-images.githubusercontent.com/5566310/109728442-303aee00-7b84-11eb-9ef4-5a2fddbbb8d3.png)

## Features

- Drag and Drop to upload files
- Assign uploaded files a ContentVersion.Type\_\_c value
- Filter files by Filename
- Datatable Options:
  - Show datatable section
  - Show delete record column
  - Show edit record column
  - download record column
- Theming Options:
  - Bold filename
  - Background & Border color of uploader dropzone
  - Color of Type badge component
  - Colors of datatable action icon buttons

## Component Properties

<!-- ![Component Properties](https://user-images.githubusercontent.com/5566310/108149925-c3165b80-70a1-11eb-9072-e8de416fc4ec.png) -->

| Property                              | Description                                                                                                            | Type                                       | Default Value |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------- |
| Record Id                             | Enter recordId if used on a Lightning Record Page or {!recordId} if used on an Experience Cloud record page (Required) | String                                     | recordId      |
| LOB (\*\* uploadFilesByMetadata only) | Line of business                                                                                                       | String                                     |               |
| Allowed File Extensions               | Comma-separated list of file extensions that can be uploaded in the format .ext, such as .pdf, .jpg, or png.           | String                                     |               |
| Show Table Component                  | Display tables of files underneath the file upload component, grouped by ContentVersion.Type\_\_c                      | Checkbox                                   | Checked       |
| Bold Filename                         | Display filename in bold in table component                                                                            | Checkbox                                   |               |
| Use Delete Column in Table            | Let users delete files within the table component                                                                      | Checkbox                                   | Checked       |
| Use Edit Column in Table              | Let users delete the file Type of a file within the table component                                                    | Checkbox                                   | Checked       |
| Use Download Column in Table          | Let users download files from the table component                                                                      | Checkbox                                   | Checked       |
| Badge Color                           | String (Lightning) or Color (Experience)                                                                               | Customize color of Badge                   | #ecebea       |
| Edit Icon Color                       | String (Lightning) or Color (Experience)                                                                               | Customize color of Edit icon               | #706e6b       |
| Preview Icon Color                    | String (Lightning) or Color (Experience)                                                                               | Customize color of Preview Icon            | #706e6b       |
| Download Icon Color                   | String (Lightning) or Color (Experience)                                                                               | Customize color of Download Icon           | #706e6b       |
| Delete Icon Color                     | String (Lightning) or Color (Experience)                                                                               | Customize color of Delete Icon             | #c23934       |
| Uploader Background Color             | String (Lightning) or Color (Experience)                                                                               | Customize color of uploader dropzone       | #5eb4ff       |
| Uploader Outline Color                | String (Lightning) or Color (Experience)                                                                               | Customize color of uploader dashed outline | #fafcfe       |

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

## Development

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

## Notes on using uploadFilesByMetadata

DocumentType\_\_mdt

| Field             | Notes                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| DeveloperName     | Should follow pattern `Internal${LOB__c}View/Partner${LOB__c}View` or `Internal${LOB__c}Upload/Partner${LOB__c}Upload`                            |
| LOB\_\_c          | "Line of Business" corresponding to the record page the LWC will be implemented in                                                                |
| Profile\_\_c      | Populate picklist options with profiles from your org                                                                                             |
| Type\_\_c         | Semi colon separated list of strings corresponding to options in the ContentVersion.Type\_\_c picklist. (Ex: "Category A; Category B; CategoryC") |
| View_Upload \_\_c | Choose whether the record is a view or upload permission definition                                                                               |
