﻿// <auto-generated />
using System;
using LearningAPI;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LearningAPI.Migrations
{
    [DbContext(typeof(MyDbContext))]
<<<<<<<< HEAD:LearningAPI/LearningAPI/Migrations/20240208021655_InitialCreate.Designer.cs
    [Migration("20240208021655_InitialCreate")]
    partial class InitialCreate
========
    [Migration("20240207180643_helllo")]
    partial class helllo
>>>>>>>> beb4478d41efeaac390afdfc291cfe656bfb506d:LearningAPI/LearningAPI/Migrations/20240207180643_helllo.Designer.cs
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("LearningAPI.Models.Cart", b =>
                {
                    b.Property<int>("Cart_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Cart_ID");

                    b.Property<DateTime>("Booking_Date")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "Booking_Date");

                    b.Property<int>("Booking_Quantity")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Booking_Quantity");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<int>("Event_ID")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Cart_ID");

                    b.ToTable("Carts");
                });

            modelBuilder.Entity("LearningAPI.Models.Event", b =>
                {
                    b.Property<int>("Event_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_ID");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "CreatedAt");

                    b.Property<string>("Event_Category")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Category");

                    b.Property<string>("Event_Description")
                        .IsRequired()
                        .HasMaxLength(600)
                        .HasColumnType("varchar(600)")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Description");

                    b.Property<int>("Event_Fee_Guest")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Fee_Guest");

                    b.Property<int>("Event_Fee_NTUC")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Fee_NTUC");

                    b.Property<int>("Event_Fee_Uplay")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Fee_Uplay");

                    b.Property<DateTime>("Event_Launching_Date")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Launching_Date");

                    b.Property<string>("Event_Location")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("varchar(300)")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Location");

                    b.Property<string>("Event_Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Name");

                    b.Property<bool>("Event_Status")
                        .HasColumnType("tinyint(1)")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Status");

                    b.Property<string>("ImageFile")
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "UpdatedAt");

                    b.Property<int>("Vacancies")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Vacancies");

                    b.HasKey("Event_ID");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("LearningAPI.Models.Member", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("date");

                    b.Property<DateTime>("ExpiredDate")
                        .HasColumnType("datetime");

                    b.Property<DateTime>("LastSubscriptionDate")
                        .HasColumnType("datetime");

                    b.Property<string>("MemberStatus")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("NRIC")
                        .IsRequired()
                        .HasMaxLength(4)
                        .HasColumnType("varchar(4)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.HasKey("UserId");

                    b.ToTable("Members");
                });

            modelBuilder.Entity("LearningAPI.Models.Review", b =>
                {
                    b.Property<int>("Review_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Review_ID");

                    b.Property<int>("Event_ID")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_ID");

                    b.Property<string>("Event_Review")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasAnnotation("Relational:JsonPropertyName", "Event_Review");

                    b.Property<int>("Rating")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Rating");

                    b.Property<int>("User_ID")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "User_ID");

                    b.HasKey("Review_ID");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("LearningAPI.Models.Tutorial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("ImageFile")
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Tutorials");
                });

            modelBuilder.Entity("LearningAPI.Models.UplayUser", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("ImageFile")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("varchar(250)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.HasKey("UserId");

                    b.ToTable("UplayUsers");
                });

            modelBuilder.Entity("LearningAPI.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("LearningAPI.Models.Voucher", b =>
                {
                    b.Property<int>("Voucher_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Voucher_ID");

                    b.Property<DateTime>("Create_date")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "Create_date");

                    b.Property<int>("Discount_In_Value")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Discount_In_Value");

                    b.Property<DateTime>("End_Date")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "End_Date");

                    b.Property<string>("ImageFile")
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)")
                        .HasAnnotation("Relational:JsonPropertyName", "ImageFile");

                    b.Property<int>("Limit_Value")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "Limit_Value");

                    b.Property<string>("Member_Type")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasAnnotation("Relational:JsonPropertyName", "Member_Type");

                    b.Property<DateTime>("Start_Date")
                        .HasColumnType("datetime")
                        .HasAnnotation("Relational:JsonPropertyName", "Start_Date");

                    b.Property<string>("Voucher_Description")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasAnnotation("Relational:JsonPropertyName", "Voucher_Description");

                    b.Property<string>("Voucher_Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasAnnotation("Relational:JsonPropertyName", "Voucher_Name");

                    b.Property<bool>("Voucher_Status")
                        .HasColumnType("tinyint(1)")
                        .HasAnnotation("Relational:JsonPropertyName", "Voucher_Status");

                    b.HasKey("Voucher_ID");

                    b.ToTable("Vouchers");
                });

            modelBuilder.Entity("LearningAPI.Models.Member", b =>
                {
                    b.HasOne("LearningAPI.Models.UplayUser", "UplayUser")
                        .WithOne("Member")
                        .HasForeignKey("LearningAPI.Models.Member", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UplayUser");
                });

            modelBuilder.Entity("LearningAPI.Models.Tutorial", b =>
                {
                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany("Tutorials")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.UplayUser", b =>
                {
                    b.Navigation("Member");
                });

            modelBuilder.Entity("LearningAPI.Models.User", b =>
                {
                    b.Navigation("Tutorials");
                });
#pragma warning restore 612, 618
        }
    }
}
