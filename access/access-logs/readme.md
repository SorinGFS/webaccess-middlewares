[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Access Logs

Records access entries into database Acccess.Logs based on `req.props` configured at `server` or `location` level using `accessLogs` directive.
Here are some of the variables we may want in the logs:

```js
req.rawHeaders;
req.headers;
req.ip;
req.ips; // x-forwarded-for, req.ips[0] is the actual client
req.originalMethod;
req.method;
req.protocol;
req.hostname;
req.port;
req.originalUrl;
req.path;
req.baseUrl; // mounted path
req.params; // relative to mounted path
req.url; // not a native Express property, it is inherited from Node, used in urlRewrite
// ========= project specific vars =========
req.device;
```

### Configuration

To enable logs for a `server` or `location` block use `accessLogs` directive as boolean or array of `req` properties like following:

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "accessLogs": true,
        "...": "...",
        "locations": [
            {
                "^/api/": {
                    "accessLogs": ["ip", "method", "hostname", "url", "headers"]
                },
                "^/auth": {
                    "accessLogs": false
                }
            }
        ]
    }
}
```

**Note:** in this example `accessLogs` is enabled at `server` level, disabled at `/auth` route and overwritten at `/api` route since in server `config` arrays are not merged but replaced by the deeper ones.
**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

In addition to the props specified in config the `accessLogs` module adds the access `time`, `durationMs` (duration in milliseconds until request end), and if `fingerprint` is enabled it also adds the `fingerprintHash`. So, by setting `"accessLogs": true` will set the simplest log having `time`, `durationMs` and `fingerprintHash` (obviously the `fingerprint` must be set).

As a security advice do not save sensitive information in the logs.

#### Status

Active, configurable.
