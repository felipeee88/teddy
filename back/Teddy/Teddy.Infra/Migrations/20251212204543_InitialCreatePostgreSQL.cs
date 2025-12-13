using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Teddy.Infra.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreatePostgreSQL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(150)", nullable: false),
                    salary = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    company_value = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    access_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_clients_deleted_at",
                table: "clients",
                column: "deleted_at");

            migrationBuilder.CreateIndex(
                name: "ix_clients_name",
                table: "clients",
                column: "name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "clients");
        }
    }
}
