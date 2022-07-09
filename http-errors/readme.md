[Back to Main Page](https://github.com/SorinGFS/webaccess#configuration)

### Error Logs

Records access errors into database Acccess.Errors based on `req.props` configured at `server` or `location` level using `errorLogs` directive.
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

To enable logs for a `server` or `location` block use `errorLogs` directive as boolean or array of `req` properties like following:

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "errorLogs": true,
        "...": "...",
        "locations": [
            {
                "^/api/": {
                    "errorLogs": ["ip", "method", "hostname", "url", "headers"]
                },
                "^/auth": {
                    "errorLogs": false
                }
            }
        ]
    }
}
```

**Note:** in this example `errorLogs` is enabled at `server` level, disabled at `/auth` route and overwritten at `/api` route since in server `config` arrays are not merged but replaced by the deeper ones.
**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

In addition to the props specified in config the `errorLogs` module adds the error `time` and error `message`. By setting `"errorLogs": true` will set the default log having `time`, `ip`, `ips`, `method`, `protocol`, `hostname`, `url` and error's `message`.

#### Status

Active, configurable.
