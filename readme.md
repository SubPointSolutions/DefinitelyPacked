# DefinitelyTyped
DefinitelyTyped is a repository for common, community-driven [MetaPack](https://github.com/SubPointSolutions/MetaPack) packages. 

We are aiming to pring together high quality packages to help SharePoint professionals and develop and deliver solutions for SharePoint.

### How does that work?
We wrote [MetaPack](https://github.com/SubPointSolutions/MetaPack) introducing a common, open-source infrastructure for packaging, delovering and deploying SharePoint solutions.
It leverages NuGet platform in order to handle packaging, versioning, dependency management. In nutshell, with metapack you can pack your SharePoint solution into a stand-alone NuGet package, refernece other packages, verion it and then push to any NuGet gallery you've got.

A beautiful part of metapack is packaging and deployment abstraction. 
You have full control over solution packaging and deployment, and we provide out of the box support for [SharePointPnP](https://github.com/SharePoint/PnP) and [SPMeta2](https://github.com/SubPointSolutions/spmeta2) - some of the most popular provisioning libraries for SharePoint.

Once you've for your solution in NuGet Gallery, you can deploy it with metapack command line interface. 

Deployment to SharePoint Online (Office365) looks as following:

``
metapack install --id 'your-solution-id' --url 'http://contoso.sharepoint.com' --username 'user@contoso.com' --userpassword 'pass@word' --spversion o365
``

SharePoint 2013 deployment can be done as foolowing:

``
metapack install --id 'your-solution-id' --url 'http://contoso.sharepoint.com' --spversion sp2013
``

### Build status
[![Build status](https://ci.appveyor.com/api/projects/status/j56lcx0bfqsfg220?svg=true)](https://ci.appveyor.com/project/SubPointSupport/definitelypacked)


### Feature requests, support and contributions

DefinitelyTyped is a part of the SPMeta2 ecosystem. In case you have unexpected issues or keen to see new features please contact support on SPMeta2 Yammer or here at github:

* https://www.yammer.com/spmeta2feedback
* https://github.com/SubPointSolutions/DefinitelyPacked
* https://github.com/SubPointSolutions/MetaPack