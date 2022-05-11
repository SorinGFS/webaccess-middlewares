[Back to Main Page](https://github.com/SorinGFS/access-proxy#configuration)

### Console Logger

In `development` environment provides console information with the variables modified by the module that just ran.

#### Documentation

Here are some of the variables we may want in the console at certain times:

```js
console.log(req.rawHeaders);
console.log(req.headers);
console.log(req.secret);
console.log(req.signedCookies);
console.log(req.cookies);
console.log(req.body);
console.log(req.ip);
console.log(req.ips); // x-forwarded-for, req.ips[0] is the actual client
console.log(req.originalMethod);
console.log(req.method);
console.log(req.protocol);
console.log(req.hostname);
console.log(req.port);
console.log(req.originalUrl);
console.log(req.path);
console.log(req.baseUrl); // mounted path
console.log(req.params); // relative to mounted path
console.log(req.url); // not a native Express property, it is inherited from Node, used in urlRewrite
console.log(req.route);
// ========= project specific vars =========
console.log(req.server);
console.log(req.site.device); // set by mobileDetect
console.log(req.site.localization); // set by localization
console.log(req.site.single); // used in API
```

However, this method has 2 problems:

-   it must be requested in several places in order to be able to identify the differences
-   pollutes the code and must be deleted or commented on after use

This module offers the possibility to console log the existing variables in the request object (`req`) at certain times chosen by us. And like all other modules it can be activated both at `server` level and at `location` level. 

#### Configuration

**ModuleName:** `devTools.consoleLogger`

Using `consoleLogger` only makes sense in request modifier modules. The list of modules for which you can configure Console Logger is limited to the following modules:

1. setDevice
1. fingerprint
1. authenticate

**Note:** The list will be updated as the project develops.

Every module requested in `consoleLogger` should be placed as a property of it, and the value can be an array of strings (any `req.key` without `req.`), or false, null, or undefined to invalidate parent setting.

#### Some usage examples:

**Enabling consoleLogger.fingerprint at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "devTools": {
            "consoleLogger": { "fingerprint": ["var1", "var2.prop1.prop2"] }
        },
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "devTools": {
                        "consoleLogger": { "authenticate": ["var1", "var2.prop1.prop2"]  }
                    }
                }
            }
        ]
    }
}
```

**Note:** In this example `consoleLogger.fingerprint` will be inactive at `/api`, instead `consoleLogger.authenticate` will be activated.

**Note:** This is just an example of how the configuration is structured, don't copy-paste without analyzing it.

#### Status

Active, configurable.
