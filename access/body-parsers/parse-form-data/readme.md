[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Parse Form-Data

This module is a `multipart/form-data` body parser middleware which uses `Multer`. It also uses the internal `Access-Control Allow-Contexts` middleware to restrict access which requires its own configuration on desired route (not enabled by default).

#### Documentation

- [Multer Official Documentation](https://github.com/expressjs/multer)

### Configuration

This module can be configured both at `server` level and `location` level. Further proccessing is possible by defining `next:true`, in which case `req.files` will contain the result of parsed form-data files, and the `req.body` will contain the remaining fields (non-files). In any case, first the files are saved to the disk using the given configuration, and further file proccessing should be continued from there. Storing files in memory is not supported by this module.

**ModuleName:** `parseFormData`

| Directive    | Type             | Default | Required | Description                                                                                                    |
| ------------ | ---------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| destination  | string           | uploads | FALSE    | The destination endpoint for uploaded files.                                                                   |
| preservePath | string           | FALSE   | FALSE    | Option to preserve path sent from multer to busboy.                                                            |
| next         | boolean          |         | FALSE    | Indicates that there would be further proccessing (e.g image resize, upload to cdn, …)                         |
| limits       | object           |         | FALSE    | Limitations for files and fields sent by Multer to Busboy (details bellow)                                     |
| files        | array of objects |         | TRUE     | Array of specific instructions for parsing files (fieldName, maxCount, filter, prefixArgs, pathArgs, nameArgs) |

#### Limits

`Multer` uses `Busboy` to impose limits upon received `multipart/form-data`, and this project emulates the same properties.

An object specifying the size limits of the following optional properties. More details of the properties can be found on [Busboy's page](https://github.com/mscdex/busboy#busboy-methods).

**Config ref:** `parseFormData.limits`

The following integer values are available:
| Key             | Description                                                             | Default   |
| --------------- | ----------------------------------------------------------------------- | --------- |
| `fieldNameSize` | Max field name size                                                     | 100 bytes |
| `fieldSize`     | Max field value size (in bytes)                                         | 1MB       |
| `fields`        | Max number of non-file fields                                           | Infinity  |
| `fileSize`      | For multipart forms, the max file size (in bytes)                       | Infinity  |
| `files`         | For multipart forms, the max number of file fields                      | Infinity  |
| `parts`         | For multipart forms, the max number of parts (fields + files)           | Infinity  |
| `headerPairs`   | For multipart forms, the max number of header key=>value pairs to parse | 2000      |

Specifying the limits can help protect your site against denial of service (DoS) attacks.

#### Files

Every file field transmited through `multipart/form-data` is accepted if corresponds to an object included in `parseFormData.files` array. If any of the transmited file does not correspond to a defined object then whole request will be rejected and no file will be uploaded.

**Config ref:** `parseFormData.files`

| Directive  | Type             | Default  | Required | Description                                                                                         |
| ---------- | ---------------- | -------- | -------- | --------------------------------------------------------------------------------------------------- |
| fieldName  | string           |          | TRUE     | The parsed multipart form-data field name sent in request.                                          |
| maxCount   | number           | infinity | FALSE    | Limits the number of files sent in a single field.                                                  |
| filter     | array of strings |          | FALSE    | Restricts upload by extension (e.g png, jpg for images), single error will reject the whole upload. |
| prefixArgs | array of strings |          | FALSE    | Generates 16 char long crc32 path segment using the provided args twice (normal plus reversed).     |
| pathArgs   | array of strings |          | FALSE    | Preformatted path segments (available patterns described below).                                    |
| nameArgs   | array of strings |          | FALSE    | Preformatted filename segments (available patterns described below).                                |

#### Path prefix

**Config ref:** `parseFormData.files[].prefixArgs`

If defined, the path prefix will be added after `parseFormData.destination`. The arguments used to construct the path prefix must be present in the request object (`req`). All the arguments provided will be concatenated in the same order and the result will be parsed with `crc32` function which will give an 8 char hex string. Knowing that `crc32` cannot ensure uniqueness the same proccess will be repeated using the initial concatenated string reversed and the result will be concatenated with the initial result, resulting a 16 char long unique string. 

**Important note:** the path prefix can be reverse engineered, the purpose of using a path prefix is not for security but for providing a unique identifier for a specific context (e.g username + hostname).

#### Path

**Config ref:** `parseFormData.files[].pathArgs`

A number of predefined patterns can be used to construct the path for uploads. Path delimiters are added automatically between patterns.

| Patterns     | Description                              |
| ------------ | ---------------------------------------- |
| timestamp    | Current timestamp.                       |
| yyyy         | Current 4 digit year.                    |
| MM           | Current 2 digit month.                   |
| dd           | Current 2 digit day of month.            |
| hh           | Current 2 digit hour.                    |
| originalName | The original filename.                   |
| md5          | The md5 digest of the original filename. |
| fieldName    | Multipart form-data field name.          |
| extension    | The file extension.                      |

#### File name

**Config ref:** `parseFormData.files[].nameArgs`

A number of predefined patterns can be used to construct the filename for uploads. Predefined delimiters are added automatically between patterns.

| Patterns     | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| timestamp    | Current timestamp.                                                               |
| dateIso      | Current ISO formatted UTC date, adapted for use in filename.                     |
| yyyy         | Current 4 digit year.                                                            |
| MM           | Current 2 digit month.                                                           |
| dd           | Current 2 digit day of month.                                                    |
| hh           | Current 2 digit hour.                                                            |
| mm           | Current 2 digit minute.                                                          |
| ss           | Current 2 digit second.                                                          |
| ms           | Current 2 digit millisecond.                                                     |
| tz           | Current time zone offset (sign + 2 digit hours + underscore + 2 digit minutes).  |
| rand16       | Random 16 chars hex string.                                                      |
| rand8        | Random 8 chars hex string.                                                       |
| originalName | The original filename.                                                           |
| md5          | The md5 digest of the original filename.                                         |
| fieldName    | Multipart form-data field name.                                                  |
| extension    | The file extension.                                                              |

#### Some usage examples:

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "...": "...",
        "locations": [
            {
                "^/upload/": {
                    "parseFormData": { 
                        "destination": "/home/web/files/public", 
                        "limits": { "fileSize": 1000000 },
                        "files": [
                            { "fieldName": "images", "maxCount": 1, "filter": [ "png", "jpg" ], "pathArgs": [ "fieldName" ], "nameArgs" [ "timestamp", "originalName" ] }
                        ] 
                    }
                }
            },
            {
                "^/user/upload/": {
                    "accessControl": { "allowContexts": [ { "user": { "role": "editor" } } ] },
                    "parseFormData": { 
                        "destination": "/home/web/files/private",
                        "limits": { "fileSize": 1000000 },
                        "files": [
                            { "fieldName": "images", "maxCount": 3, "filter": [ "png", "jpg" ], "prefixArgs": [ "site.user.id", "hostname" ], "pathArgs": [ "fieldName" ] }                          
                        ]
                    }
                }
            },
            {
                "^/srv/upload/s3/": {
                    "accessControl": { "allowContexts": [ { "user": { "role": "admin" } } ] },
                    "parseFormData": { 
                        "destination": "tmp",
                        "next": true,
                        "limits": { "files": 10, "fileSize": 1000000000 },
                        "files": [
                            { "fieldName": "audio", "maxCount": 3, "filter": [ "mp3", "wav" ], "prefixArgs": [ "site.user.id", "hostname" ], "pathArgs": [ "fieldName" ] },
                            { "fieldName": "videos", "maxCount": 3, "filter": [ "mp4", "mkv" ], "prefixArgs": [ "site.user.id", "hostname" ], "pathArgs": [ "fieldName" ] }
                        ]                        
                    },
                }
            }            
        ]
    }
}
```

**Note:** In this example `parseFormData` is configured on 3 routes with different settings. If the`parseFormData.destination` does not begin with `/` then its base root is the project root.

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

#### Status

Active, configurable