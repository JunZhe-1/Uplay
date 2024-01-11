﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace LearningAPI.Migrations
{
    /// <inheritdoc />
<<<<<<<< HEAD:LearningAPI/LearningAPI/Migrations/20240110013102_InitialCreate.cs
    public partial class InitialCreate : Migration
========
    public partial class hello : Migration
>>>>>>>> 93da817bec2223f0084a9a43f7a929ebeb982829:LearningAPI/LearningAPI/Migrations/20240109042549_hello.cs
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Event_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Event_Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Event_Description = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false),
                    Event_Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Event_Location = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false),
                    Event_Fee_Guest = table.Column<int>(type: "int", nullable: false),
                    Event_Fee_Uplay = table.Column<int>(type: "int", nullable: false),
                    Event_Fee_NTUC = table.Column<int>(type: "int", nullable: false),
                    Vacancies = table.Column<int>(type: "int", nullable: false),
                    ImageFile = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Event_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UplayUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    EmailAddress = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false),
                    UserName = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UplayUsers", x => x.UserId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    Voucher_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Voucher_Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Voucher_Description = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Start_Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    End_Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    Discount_type = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Discount_In_Percentage = table.Column<int>(type: "int", nullable: false),
                    Discount_In_Value = table.Column<int>(type: "int", nullable: false),
                    Create_date = table.Column<DateTime>(type: "datetime", nullable: false),
                    ImageFile = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Member_Type = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.Voucher_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    NRIC = table.Column<string>(type: "varchar(9)", maxLength: 9, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    MemberStatus = table.Column<string>(type: "longtext", nullable: false),
                    LastSubscriptionDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ExpiredDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Members_UplayUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "UplayUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tutorials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    ImageFile = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tutorials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tutorials_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorials_UserId",
                table: "Tutorials",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Members");

            migrationBuilder.DropTable(
                name: "Tutorials");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropTable(
                name: "UplayUsers");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
