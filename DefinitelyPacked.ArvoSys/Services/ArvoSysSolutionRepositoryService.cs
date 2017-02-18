using System;
using System.Collections.Generic;
using System.IO;
using DefinitelyPacked.ArvoSys.Models;
using MetaPack.Core.Packaging;
using MetaPack.Core.Services;
using MetaPack.SPMeta2;
using MetaPack.SPMeta2.Services;
using SPMeta2.BuiltInDefinitions;
using SPMeta2.Definitions;
using SPMeta2.Syntax.Default;
using SPMeta2.Models;

namespace DefinitelyPacked.ArvoSys.Services
{
    public class ArvoSysSolutionRepositoryService : SolutionRepositoryServiceBase
    {
        #region methods

        public override IEnumerable<Stream> GetSolutionPackageStreams()
        {
            var packages = new List<Stream>();

            var rootAssetFolder = Path.GetDirectoryName(GetType().Assembly.Location) + "/ArvoSysModuleFiles";

            var imageFieldModuleAssetFolder = Path.Combine(rootAssetFolder, "SPF-ImageField");
            var fieldSettingsAssetFolder = Path.Combine(rootAssetFolder, "SPF-FieldSettings");
            var newItemCalloutAssetFolder = Path.Combine(rootAssetFolder, "SPF-NewItemCallout");

            packages.Add(CreateSPFFieldSettingsPackage(SPFImageFieldModel.DeployModel(imageFieldModuleAssetFolder), package =>
            {
                var solutionId = "DefinitelyPacked.ArvoSys.spf-imagefield";

                package.Id = solutionId;
                package.Version = "1.0.0";

                package.Name = "spf-imagefield";
                package.Title = "spf-imagefield";

                package.ProjectUrl = "https://github.com/sergeisnitko/spf-imagefield";

            }));

            packages.Add(CreateSPFFieldSettingsPackage(SPFFieldSettingsModel.DeployModel(fieldSettingsAssetFolder), package =>
            {
                var solutionId = "DefinitelyPacked.ArvoSys.spf-fieldsettings";

                package.Id = solutionId;
                package.Version = "1.0.3";

                package.Name = "spf-fieldsettings";
                package.Title = "spf-fieldsettings";

                package.ProjectUrl = "https://github.com/sergeisnitko/spf-fieldsettings";
            }));

            packages.Add(CreateSPFFieldSettingsPackage(SPFNewItemCalloutModel.DeployModel(newItemCalloutAssetFolder), package =>
            {
                var solutionId = "DefinitelyPacked.ArvoSys.spf-newitemcallout";

                package.Id = solutionId;
                package.Version = "1.0.0";

                package.Name = "spf-newitemcallout";
                package.Title = "spf-newitemcallout";

                package.ProjectUrl = "https://github.com/sergeisnitko/spf-newitemcallout";
            }));

            return packages;
        }

        protected virtual Stream CreateSPFFieldSettingsPackage(ModelNode model, Action<SolutionPackageBase> action)
        {
            // save solution to XML file
            var modelXml = SPMeta2Model.ToXML(model);

            var tmpFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(tmpFolder);

            var modelFilePath = Path.Combine(tmpFolder, "model.xml");
            File.WriteAllText(modelFilePath, modelXml);

            // pack model
            var solutionPackage = GetSolutionPackageTemplate();

            // update version and add model
            action(solutionPackage);

            solutionPackage.ModelFolders.Add(Path.GetDirectoryName(modelFilePath));

            // pack to NuGet package
            var packageService = new SPMeta2SolutionPackageService();
            var solutionPackageStream = packageService.Pack(solutionPackage);

            return solutionPackageStream;
        }

        protected virtual SPMeta2SolutionPackage GetSolutionPackageTemplate()
        {
            var solutionPackage = new SPMeta2SolutionPackage();

            solutionPackage.Description = "SharePoint Flow Image Field. The SharePoint CSR UI control for working with pictures/images in field (upload, select from library)";

            solutionPackage.Authors = "DefinitelyPacked";
            solutionPackage.Company = "DefinitelyPacked";
            solutionPackage.Owners = "DefinitelyPacked";

            solutionPackage.ReleaseNotes = string.Empty;
            solutionPackage.Summary = string.Empty;

            solutionPackage.ProjectUrl = "https://github.com/SubPointSolutions/DefinitelyPacked";
            solutionPackage.IconUrl = "https://sergeisnitko.github.io/repos/images/arvo_logo_simple.png";
            solutionPackage.LicenseUrl = "https://opensource.org/licenses/MIT";

            solutionPackage.Copyright = string.Empty;
            solutionPackage.Tags = "SharePoint SP2013 Foundation Standard Enterprise SPO SharePointOnline O365 Office365 Office365Dev Provision SPMeta2 ARVO SPF SPFlow JavaScript CSR Client-Side Rendering";

            return solutionPackage;
        }

        #endregion
    }
}
