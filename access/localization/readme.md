[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Localization

This module enables `localization` using `MaxMind Database`. If enabled, the localization data will be available in `req.site.localization` variable which can then be used to perform various tasks.

#### Documentation
- [Official Documentation](https://github.com/geoip-lite/node-geoip)

#### Configuration

Initially this module commes with an outdated version of `MaxMind Geoip Database` which can then be updated using the following `npm` command:

```shell
npm run updateMaxMindDb -- license_key=YOUR_LICENSE_KEY
```

The update can be done while server is running and the `in-memory` database will be updated automatically.

#### Some usage examples:

**Enabling localization at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "localization": true,
        "...": "...",
        "locations": [
            {
                "^/public/": {
                    "localization": false
                }
            }
        ]
    }
}
```

**Note:** in this example `localization` is enabled at `server` level, disabled at `/public/` route.

#### Status

Active, configurable.