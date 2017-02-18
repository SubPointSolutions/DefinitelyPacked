using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MetaPack.Core.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NuGet;
using System.IO;
using System.Reflection;
using System.Diagnostics;
using DefinitelyPacked.ArvoSys.Services;
using DefinitelyPacked.jQuery.Services;

namespace DefinitelyPacked.Tests.Scenarios
{
    [TestClass]
    public class DefinitelyPackedTests
    {
        #region constructors

        public DefinitelyPackedTests()
        {
            AllPackages = new List<IPackage>();

            var packagesDirectoryName = "definitelypacked-packages";

            var assemblyDirectoryPath = Path.GetDirectoryName(GetType().Assembly.Location);

            PackagesDirPath = Path.Combine(assemblyDirectoryPath, packagesDirectoryName);

            ReadmeFilePath = Path.GetFullPath(Path.Combine(assemblyDirectoryPath + "/../../../", "README.md"));
            ReadmeTemplateFilePath = Path.GetFullPath(Path.Combine(assemblyDirectoryPath + "/../../../", "README-TMPL.MD"));

            if (!File.Exists(ReadmeFilePath))
                throw new Exception(string.Format("Cannot find readme file:[{0}]", ReadmeFilePath));

            Directory.CreateDirectory(PackagesDirPath);
        }

        #endregion

        #region properties

        public string PackagesDirPath { get; set; }

        public string ReadmeFilePath { get; set; }
        public string ReadmeTemplateFilePath { get; set; }

        protected List<IPackage> AllPackages { get; set; }

        #endregion

        #region tests

        [TestMethod]
        [TestCategory("DefinitelyPacked.Core")]
        public void Create_DefinitelyPacked_Packages()
        {
            var solutionRepositoryTypes = new Type[]
            {
               typeof(jQuerySolutionRepositoryService),
                typeof(ArvoSysSolutionRepositoryService)
            };

            foreach (var solutionRepositoryType in solutionRepositoryTypes)
            {
                var impl = Activator.CreateInstance(solutionRepositoryType) as SolutionRepositoryServiceBase;
                var solutionPackages = impl.GetSolutionPackageStreams();

                foreach (var stream in solutionPackages)
                    CreatePackageFile(stream, PackagesDirPath);
            }

            UpdateReadmeFile(AllPackages);
        }

        private void UpdateReadmeFile(List<IPackage> packages)
        {
            var packagesListString = new StringBuilder();

            foreach (var packageKey in packages.GroupBy(p => p.Id))
            {
                var packageId = packageKey.Key;

                packagesListString.AppendFormat("{0}{1}", packageId, Environment.NewLine);

                foreach (var package in packageKey.OrderByDescending(p => p.Version))
                    packagesListString.AppendFormat("* {0}{1}", package.Version, Environment.NewLine);

                packagesListString.AppendFormat("{0}",Environment.NewLine);
                packagesListString.AppendFormat("{0}", Environment.NewLine);
            }

            var fileContent = File.ReadAllText(ReadmeTemplateFilePath);
            fileContent = fileContent.Replace("[ALL_PACKAGES_LIST]", packagesListString.ToString());

            File.WriteAllText(ReadmeFilePath, fileContent);
        }

        private void CreatePackageFile(Stream stream, string packagesDirPath)
        {
            var package = new ZipPackage(stream);
            var packageFileName = string.Format("{0}.{1}.nupkg", package.Id, package.Version);

            AllPackages.Add(package);

            var filePath = packagesDirPath + "/" + packageFileName;

            using (var fileStream = File.Create(filePath))
            {
                fileStream.Seek(0, SeekOrigin.Begin);

                using (var s = package.GetStream())
                    s.CopyTo(fileStream);
            }
        }

        #endregion


    }
}
