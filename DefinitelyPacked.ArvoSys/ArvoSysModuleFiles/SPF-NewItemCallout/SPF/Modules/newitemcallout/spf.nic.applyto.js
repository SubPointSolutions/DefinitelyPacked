(function () {
    window.SPFNIC = window.SPFNIC || {};

    window.SPFNIC.Params = {
        UpdateFolderCT: false, // Update current folders avalible content types by the next param ContentTypes
        DParamsFrom:"",
        ReloadPage: true, //Reloads the page if current folder content types were updated. Fixes the problem with avalible buttons in ribbon
        Mask: true, // Make the mask of the grid while implementing the solution
        HideIfOne: false, // No callout if there is only one avalible content type
        ContentTypes: {
            "0x012001": [
                "0x010100768CF35097A17A488FC750643A59C7CD",
                "0x0101009148F5A04DDD49CBA7127AADA5FB792B006973ACD696DC4858A76371B2FB2F439A001FBAF12C8EC82546BAF83FC9F0D58BCC",
                "0x0120040016089EB923EBE645917A775E7D6E976E"
            ],
            "0x012004008E7E76B8F696AC48B557FB538ACC63A2": ["0x010100768CF35097A17A488FC750643A59C7CD", "0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF39", "0x01010008B364686B9D4B41967804C4A8C80A51"]
        } // The tree of content types and reletive content types in folders
    };

})();