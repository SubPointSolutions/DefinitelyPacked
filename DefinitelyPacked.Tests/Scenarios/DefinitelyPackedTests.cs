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
            var packagesDirectoryName = "definitelypacked-packages";

            var assemblyDirectoryPath = Path.GetDirectoryName(GetType().Assembly.Location);
            PackagesDirPath = Path.Combine(assemblyDirectoryPath, packagesDirectoryName);

            Directory.CreateDirectory(PackagesDirPath);
        }

        #endregion

        #region properties

        public string PackagesDirPath { get; set; }

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
        }

        private void CreatePackageFile(Stream stream, string PackagesDirPath)
        {
            var package = new ZipPackage(stream);
            var packageFileName = string.Format("{0}.{1}.nupkg", package.Id, package.Version);

            var filePath = PackagesDirPath + "/" + packageFileName;

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
