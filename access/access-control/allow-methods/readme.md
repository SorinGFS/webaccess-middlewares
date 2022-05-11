[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Access Control - Allow Methods

This module allows restricting access based on the http method on a certain route or even server.

### Configuration

To enable method firewall for a `server` or `location` block use `accessControl.allowMethods` directive (as an array of a single or multiple `http methods`) like following:

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "accessControl": { "allowMethods": ["GET", "HEAD", "OPTIONS"] },
        "...": "...",
        "locations": [
            {
                "^/admin/": {
                    "accessControl": { "allowMethods": ["GET", "HEAD", "OPTIONS", "POST", "PATCH", "PUT", "DELETE"] }
                },
            },
            {
                "^/public/": {
                    "accessControl": { "allowMethods": false }
                }
            }
        ]
    }
}
```

**Note:** in this example `accessControl.allowMethods` is enabled at `server` level, overwritten at `/admin/` route since in server `config` arrays are not merged but replaced by the deeper ones, and disabled at `/public/` route.

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

#### Status

Active, configurable.
