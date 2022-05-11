[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Access Control - Allow Ips ( Firewall )

This module is an ip based firewall and although its use is not the most appropriate method of protection there are cases when we need extra protection on a certain route or even server.

### Configuration

To enable firewall for a `server` or `location` block use `accessControl.allowIps` directive (as an array of a single or multiple ips) like following:

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "accessControl": { "allowIps": ["1.2.3.4"] },
        "...": "...",
        "locations": [
            {
                "^/admin/": {
                    "accessControl": { "allowIps": ["123.123.123.123"] }
                }
            },
            {
                "^/public/": {
                    "accessControl": { "allowIps": false }
                }
            }
        ]
    }
}
```

**Note:** in this example `accessControl.allowIps` is enabled at `server` level, overwritten at `/admin/` route since in server `config` arrays are not merged but replaced by the deeper ones, and disabled at `/public/` route.

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

#### Status

Active, configurable.
