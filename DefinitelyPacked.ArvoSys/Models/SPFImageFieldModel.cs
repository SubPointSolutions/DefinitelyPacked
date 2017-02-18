using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using SPMeta2.BuiltInDefinitions;
using SPMeta2.Definitions;
using SPMeta2.Enumerations;
using SPMeta2.Syntax.Default;
using SPMeta2.Syntax.Default.Utils;

namespace DefinitelyPacked.ArvoSys.Models
{
    public static class SPFImageFieldModel
    {
        public static SiteModelNode DeployModel(string assetFolder)
        {
            // keep model clean, parametrised
            if (!Directory.Exists(assetFolder))
                throw new Exception(string.Format("Cannot find folder:[{0}]", assetFolder));

            return SPMeta2Model.NewSiteModel(site =>
            {
                site.AddRootWeb(new RootWebDefinition(), rootWeb =>
                {
                    rootWeb.AddHostList(BuiltInListDefinitions.Catalogs.MasterPage, list =>
                    {
                        ModuleFileUtils.LoadModuleFilesFromLocalFolder(list, assetFolder);
                    });
                });
            });
        }
    }
}
