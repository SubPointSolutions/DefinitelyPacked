using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MetaPack.Core.Common;
using MetaPack.Core.Packaging;
using MetaPack.Core.Services;
using MetaPack.SPMeta2;
using MetaPack.SPMeta2.Services;
using SPMeta2.BuiltInDefinitions;
using SPMeta2.Definitions;
using SPMeta2.Syntax.Default;

namespace DefinitelyPacked.jQuery.Services
{
    public class jQuerySolutionRepositoryService : SolutionRepositoryServiceBase
    {
        #region methods

        public override IEnumerable<Stream> GetSolutionPackageStreams()
        {
            var packages = CreateMetaPackPackages();

            return packages;
        }

        protected virtual IEnumerable<Stream> CreateMetaPackPackages()
        {
            var result = new List<Stream>();

            // pack model
            var solutionPackage = GetSolutionPackageTemplate();

            // update version and add model
            solutionPackage.Version = "0.1.0-beta1";

            var assemblyDirectoryPath = Path.GetDirectoryName(GetType().Assembly.Location);
            var jQueryDirectoryPath = Path.Combine(assemblyDirectoryPath, "jQuery");

            if (!Directory.Exists(jQueryDirectoryPath))
                throw new Exception(string.Format("Cannot find directory:[{0}]", jQueryDirectoryPath));

            var jQueryVersionFolderPaths = Directory.GetDirectories(jQueryDirectoryPath);

            foreach (var versionFolderPath in jQueryVersionFolderPaths)
            {
                var jQueryVersion = Path.GetFileName(versionFolderPath);

                var versionFolderName = (new DirectoryInfo(versionFolderPath)).Name;
                var filePaths = Directory.GetFiles(versionFolderPath, "*.*");

                // create model
                var webModel = SPMeta2Model.NewWebModel(web =>
                {
                    web.AddHostList(BuiltInListDefinitions.StyleLibrary, list =>
                    {
                        list.AddFolder(new FolderDefinition { Name = "jQuery" }, jQueryFolder =>
                        {
                            jQueryFolder.AddFolder(new FolderDefinition { Name = versionFolderName }, folder =>
                            {
                                foreach (var filePath in filePaths)
                                {
                                    folder.AddModuleFile(new ModuleFileDefinition
                                    {
                                        FileName = Path.GetFileName(filePath),
                                        Content = File.ReadAllBytes(filePath)
                                    });
                                }
                            });
                        });
                    });
                });

                // save solution to XML file
                var xmlContext = SPMeta2Model.ToXML(webModel);



                // create ModelContainerBase, put serialized model there
                var modelContainer = new ModelContainerBase
                {
                    Model = Encoding.UTF8.GetBytes(xmlContext),
                };

                modelContainer.AdditionalOptions.Add(new OptionValue
                {
                    Name = "_metapack.model.id",
                    Value = string.Format("jQuery.{0}", jQueryVersion)
                });

                solutionPackage.AddModel(modelContainer);
            }

            // pack to NuGet package
            var packageService = new SPMeta2SolutionPackageService();
            var solutionPackageStream = packageService.Pack(solutionPackage);

            // add to result strems
            result.Add(solutionPackageStream);

            return result;
        }

        private static SolutionPackageBase GetSolutionPackageTemplate()
        {
            var solutionPackage = new SolutionPackageBase();

            solutionPackage.Name = "DefinitelyPacked.jQuery";
            solutionPackage.Title = "DefinitelyPacked.jQuery";

            solutionPackage.Description = "Delivers jQuery JavaScript library to 'Style library'";
            solutionPackage.Id = "DefinitelyPacked.jQuery";

            solutionPackage.Authors = "DefinitelyPacked";
            solutionPackage.Company = "DefinitelyPacked";
            solutionPackage.Owners = "DefinitelyPacked";

            solutionPackage.ReleaseNotes = string.Empty;
            solutionPackage.Summary = string.Empty;
            solutionPackage.ProjectUrl = "https://github.com/SubPointSolutions/DefinitelyPacked";
            solutionPackage.IconUrl = "https://github.com/SubPointSolutions/DefinitelyPacked/DefinitelyPacked.png";
            solutionPackage.LicenseUrl = "https://opensource.org/licenses/MIT";

            solutionPackage.Copyright = string.Empty;
            solutionPackage.Tags = "jQuery SPMeta2 MetaPack DefinitelyPacked SharePoint Office365 Office365Dev SharePointOnline";

            // flag a provider which will be used for solution package deployment
            solutionPackage.AdditionalOptions.Add(new OptionValue
            {
                Name = DefaultOptions.SolutionToolPackage.PackageId.Id,
                Value = "MetaPack.SPMeta2"
            });

            return solutionPackage;
        }

        #endregion
    }
}
