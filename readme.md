# DefinitelyTyped (beta)
DefinitelyTyped is a repository for common, community-driven [MetaPack](https://github.com/SubPointSolutions/MetaPack) packages. 

We are aiming to pring together high quality packages to help SharePoint professionals and develop and deliver solutions for SharePoint.

### Build status
[![Build status](https://ci.appveyor.com/api/projects/status/j56lcx0bfqsfg220?svg=true)](https://ci.appveyor.com/project/SubPointSupport/definitelypacked)


### How does that work?
We wrote [MetaPack](https://github.com/SubPointSolutions/MetaPack) introducing a common, open-source infrastructure for packaging, delovering and deploying SharePoint solutions.
It leverages NuGet platform in order to handle packaging, versioning, dependency management. In nutshell, with metapack you can pack your SharePoint solution into a stand-alone NuGet package, refernece other packages, verion it and then push to any NuGet gallery you've got.

A beautiful part of metapack is packaging and deployment abstraction. 
You have full control over solution packaging and deployment, and we provide out of the box support for [SharePointPnP](https://github.com/SharePoint/PnP) and [SPMeta2](https://github.com/SubPointSolutions/spmeta2) - some of the most popular provisioning libraries for SharePoint.

Once you've for your solution in NuGet Gallery, you can deploy it with metapack command line interface. 

Deployment to SharePoint Online (Office365) looks as following:

```ps
metapack install --id 'your-solution-id' 
                 --url 'http://contoso.sharepoint.com' 
                 --username 'user@contoso.com' 
                 --userpassword 'pass@word' 
                 --spversion o365
```

SharePoint 2013 deployment can be done as foolowing:

```ps
metapack install --id 'your-solution-id' 
                 --url 'http://contoso.sharepoint.com' 
                 --spversion sp2013
```


### Available packages
DefinitelyTyped is in beta testing. All packages are available only appveyor build:
* Build artifacts: [https://ci.appveyor.com/project/SubPointSupport/definitelypacked/build/artifacts](https://ci.appveyor.com/project/SubPointSupport/definitelypacked/build/artifacts)
* Build nuget feed: [https://ci.appveyor.com/nuget/definitelypacked-nuget](https://ci.appveyor.com/nuget/definitelypacked-nuget)

The foolowing packages are implemented:

DefinitelyPacked.jQuery
* 0.1.0-beta1


DefinitelyPacked.ArvoSys.spf-imagefield
* 1.0.0


DefinitelyPacked.ArvoSys.spf-fieldsettings
* 1.0.3


DefinitelyPacked.ArvoSys.spf-newitemcallout
* 1.0.0




### Feature requests, support and contributions

DefinitelyTyped is a part of the SPMeta2 ecosystem. In case you have unexpected issues or keen to see new features please contact support on SPMeta2 Yammer or here at github:

* https://www.yammer.com/spmeta2feedback
* https://github.com/SubPointSolutions/DefinitelyPacked
* https://github.com/SubPointSolutions/MetaPack