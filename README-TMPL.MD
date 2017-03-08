# DefinitelyPacked (beta)
DefinitelyPacked is a repository for common, community-driven [MetaPack](https://github.com/SubPointSolutions/MetaPack) packages. We are aiming to bring together high-quality packages to help SharePoint professionals and develop and deliver solutions for SharePoint - both on-premises and SharePoint online.

### Build status
| Branch  | Status |
| ------------- | ------------- |
| dev   | [![Build status](https://ci.appveyor.com/api/projects/status/j56lcx0bfqsfg220/branch/dev?svg=true)](https://ci.appveyor.com/project/SubPointSupport/definitelypacked/branch/dev)  |
| beta  | [![Build status](https://ci.appveyor.com/api/projects/status/j56lcx0bfqsfg220/branch/beta?svg=true)](https://ci.appveyor.com/project/SubPointSupport/definitelypacked/branch/beta)  |
| master| [![Build status](https://ci.appveyor.com/api/projects/status/j56lcx0bfqsfg220/branch/master?svg=true)](https://ci.appveyor.com/project/SubPointSupport/definitelypacked/branch/master) |

### How does that work?
We created [MetaPack](http://docs.subpointsolutions.com/metapack/) introducing a common, open-source infrastructure for packaging, delivering and deploying SharePoint solutions.

It leverages NuGet platform to handle packaging, versioning and dependency management for SharePoint solutions. In a nutshell, MetaPack turns SharePoint customizations into NuGet packages so that we can reference other packages, version it and then push to any NuGet gallery you've got.

A beautiful part of MetaPack is packaging and deployment abstraction. You have full control over solution packaging and deployment, and we provide out of the box support for [SharePointPnP](https://github.com/SharePoint/PnP) and [SPMeta2](https://github.com/SubPointSolutions/spmeta2) - some of the most popular provisioning libraries for SharePoint.

Once you've for your solution in NuGet Gallery, you can deploy it with [MetaPack API](http://docs.subpointsolutions.com/metapack/getting-started/) or [command line interface](http://docs.subpointsolutions.com/metapack/cli/). 

Please refer to MetaPack documentation to get more understanding on how underlying infrastructure works:
* [What is MetaPack?](http://docs.subpointsolutions.com/metapack/)
* [Getting started with MetaPack API](http://docs.subpointsolutions.com/metapack/getting-started)
* [Using MetaPack CLI](http://docs.subpointsolutions.com/metapack/cli)

### Getting started with DefinitelyPacked
Firs of all, you need to install the latest [MetaPack CLI](http://docs.subpointsolutions.com/metapack/cli). Once done, you would be able to deploy all DefinitelyPacked packages as easy as this:

#### SharePoint Online provision
```ps
metapack install `
        --id "package-id" `
        --url "http://contoso-intranet.sharepoint.com" `
        --username "user@contoso.com" `
        --userpassword "pass@word1" `
        --spversion "o365"
```

#### SharePoint 2013 provision
```ps
metapack install `
        --id "package-id" `
        --url "http://contoso-intranet.sharepoint.com" `
        --username "user@contoso.com" `
        --userpassword "pass@word1" `
        --spversion "sp2013"
```

**DefinitelyPacked is in beta testing**, so please add --source to get packages from the following NuGet feed as following:
* Build NuGet feed: [https://ci.appveyor.com/nuget/definitelypacked-nuget](https://ci.appveyor.com/nuget/definitelypacked-nuget)

```ps
metapack install `
        --id "package-id" `
        --url "http://contoso-intranet.sharepoint.com" `
        --username "user@contoso.com" `
        --userpassword "pass@word1" `
        --spversion "o365"
		--source https://ci.appveyor.com/nuget/definitelypacked-nuget
```

More options for deployments via MetaPack CLI are available here:
* [MetaPack CLI](http://docs.subpointsolutions.com/metapack/cli)
* [MetaPack API](http://docs.subpointsolutions.com/metapack/getting-started)

### Available packages
DefinitelyPacked is in beta testing. All packages are available only AppVeyor build:
* Build artifacts: [https://ci.appveyor.com/project/SubPointSupport/definitelypacked/build/artifacts](https://ci.appveyor.com/project/SubPointSupport/definitelypacked/build/artifacts)
* Build NuGet feed: [https://ci.appveyor.com/nuget/definitelypacked-nuget](https://ci.appveyor.com/nuget/definitelypacked-nuget)

The foolowing packages are implemented:

[ALL_PACKAGES_LIST]

### Feature requests, support and contributions

DefinitelyPacked is a part of the SPMeta2 ecosystem. In case you have unexpected issues or keen to see new features please contact support on SPMeta2 Yammer or here at github:

* https://www.yammer.com/spmeta2feedback
* https://github.com/SubPointSolutions/DefinitelyPacked
* https://github.com/SubPointSolutions/MetaPack


