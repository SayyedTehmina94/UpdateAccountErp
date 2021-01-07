using Microsoft.EntityFrameworkCore.Migrations;

namespace AccountErp.DataLayer.Migrations
{
    public partial class VendorChange27082020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RegistrationNumber",
                table: "Vendors",
                newName: "HSTNumber");

            migrationBuilder.RenameColumn(
                name: "HSTNumber",
                table: "Bills",
                newName: "RefrenceNumber");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HSTNumber",
                table: "Vendors",
                newName: "RegistrationNumber");

            migrationBuilder.RenameColumn(
                name: "RefrenceNumber",
                table: "Bills",
                newName: "HSTNumber");
        }
    }
}
