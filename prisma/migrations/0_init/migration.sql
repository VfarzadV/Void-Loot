BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Brands] (
    [BrandID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(100) NOT NULL,
    [Slug] NVARCHAR(100) NOT NULL,
    [ImageUrl] NVARCHAR(500),
    CONSTRAINT [PK__Brands__DAD4F3BE09F14FCB] PRIMARY KEY CLUSTERED ([BrandID] ASC),
    CONSTRAINT [UQ__Brands__BC7B5FB65AEB54A8] UNIQUE NONCLUSTERED ([Slug] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[CommunityComments] (
    [CommentID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [Content] NVARCHAR(max) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CommunityComments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CommunityComments_pkey] PRIMARY KEY CLUSTERED ([CommentID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[CommunityPostLikes] (
    [PostID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CommunityPostLikes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CommunityPostLikes_pkey] PRIMARY KEY CLUSTERED ([PostID] ASC,[UserID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[CommunityPosts] (
    [PostID] INT NOT NULL IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [Title] NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(max) NOT NULL,
    [Category] NVARCHAR(50) NOT NULL,
    [Tags] NVARCHAR(max) NOT NULL CONSTRAINT [CommunityPosts_Tags_df] DEFAULT '[]',
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CommunityPosts_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CommunityPosts_pkey] PRIMARY KEY CLUSTERED ([PostID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[Notifications] (
    [NotificationID] INT NOT NULL IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [EventKey] NVARCHAR(200) NOT NULL,
    [Type] NVARCHAR(50) NOT NULL,
    [ReferenceID] INT,
    [Details] NVARCHAR(300),
    [IsRead] BIT NOT NULL CONSTRAINT [Notifications_IsRead_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Notifications_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Notifications_pkey] PRIMARY KEY CLUSTERED ([NotificationID] ASC),
    CONSTRAINT [Notifications_UserID_EventKey_key] UNIQUE NONCLUSTERED ([UserID] ASC,[EventKey] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[OrderItems] (
    [OrderItemID] INT NOT NULL IDENTITY(1,1),
    [OrderID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    [Quantity] INT NOT NULL,
    [UnitPrice] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [PK__OrderIte__57ED06A156A527FC] PRIMARY KEY CLUSTERED ([OrderItemID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [OrderID] INT NOT NULL IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [TotalAmount] DECIMAL(10,2) NOT NULL,
    [Status] NVARCHAR(50) CONSTRAINT [DF__Orders__Status__2B3F6F97] DEFAULT 'Processing',
    [OrderDate] DATETIME CONSTRAINT [DF__Orders__OrderDat__2C3393D0] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Orders__C3905BAFB0E2A9EF] PRIMARY KEY CLUSTERED ([OrderID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[Products] (
    [ProductID] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(150) NOT NULL,
    [Price] DECIMAL(10,2) NOT NULL,
    [Stock] INT NOT NULL CONSTRAINT [DF__Products__Stock__286302EC] DEFAULT 0,
    [Category] NVARCHAR(50),
    [ImageUrl] NVARCHAR(255),
    [BrandID] INT,
    [Description] NVARCHAR(max),
    [HeroImage] NVARCHAR(max),
    [Metacritic] INT,
    [ReleaseYear] NVARCHAR(10),
    [Genre] NVARCHAR(100),
    CONSTRAINT [PK__Products__B40CC6ED4E53D2A5] PRIMARY KEY CLUSTERED ([ProductID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[Promotions] (
    [PromotionID] INT NOT NULL IDENTITY(1,1),
    [ProductID] INT NOT NULL,
    [Title] NVARCHAR(200),
    [DiscountPercentage] DECIMAL(5,2) NOT NULL,
    [StartsAt] DATETIME2 NOT NULL,
    [EndsAt] DATETIME2 NOT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [Promotions_IsActive_df] DEFAULT 1,
    CONSTRAINT [Promotions_pkey] PRIMARY KEY CLUSTERED ([PromotionID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[SupportTickets] (
    [TicketID] INT NOT NULL IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [Subject] NVARCHAR(200) NOT NULL,
    [Category] NVARCHAR(50) NOT NULL,
    [Message] NVARCHAR(max) NOT NULL,
    [Status] NVARCHAR(30) NOT NULL CONSTRAINT [SupportTickets_Status_df] DEFAULT 'Open',
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [SupportTickets_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SupportTickets_pkey] PRIMARY KEY CLUSTERED ([TicketID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61974C8796] PRIMARY KEY CLUSTERED ([diagram_id] ASC),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id] ASC,[name] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[UserCartItems] (
    [UserID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    [Quantity] INT NOT NULL CONSTRAINT [UserCartItems_Quantity_df] DEFAULT 1,
    [AddedAt] DATETIME2 NOT NULL CONSTRAINT [UserCartItems_AddedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserCartItems_pkey] PRIMARY KEY CLUSTERED ([UserID] ASC,[ProductID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[UserProfiles] (
    [UserID] INT NOT NULL,
    [AvatarUrl] NVARCHAR(1000),
    [BannerUrl] NVARCHAR(1000),
    [Level] INT NOT NULL CONSTRAINT [UserProfiles_Level_df] DEFAULT 1,
    [DisplayName] NVARCHAR(100),
    CONSTRAINT [UserProfiles_pkey] PRIMARY KEY CLUSTERED ([UserID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserID] INT NOT NULL IDENTITY(1,1),
    [Username] NVARCHAR(50) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [JoinDate] DATETIME CONSTRAINT [DF__Users__JoinDate__25869641] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Users__1788CCAC1A8E4050] PRIMARY KEY CLUSTERED ([UserID] ASC),
    CONSTRAINT [UQ__Users__A9D105348ECBDF2E] UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [UQ_Users_Username] UNIQUE NONCLUSTERED ([Username] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[UserSessions] (
    [SessionID] NVARCHAR(64) NOT NULL,
    [UserID] INT NOT NULL,
    [ExpiresAt] DATETIME2 NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [UserSessions_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserSessions_pkey] PRIMARY KEY CLUSTERED ([SessionID] ASC)
);

-- CreateTable
CREATE TABLE [dbo].[UserWishlistItems] (
    [UserID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    [AddedAt] DATETIME2 NOT NULL CONSTRAINT [UserWishlistItems_AddedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserWishlistItems_pkey] PRIMARY KEY CLUSTERED ([UserID] ASC,[ProductID] ASC)
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CommunityComments_PostID_CreatedAt_idx] ON [dbo].[CommunityComments]([PostID] ASC, [CreatedAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CommunityPostLikes_UserID_idx] ON [dbo].[CommunityPostLikes]([UserID] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CommunityPosts_CreatedAt_idx] ON [dbo].[CommunityPosts]([CreatedAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Notifications_UserID_CreatedAt_idx] ON [dbo].[Notifications]([UserID] ASC, [CreatedAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Promotions_IsActive_StartsAt_EndsAt_idx] ON [dbo].[Promotions]([IsActive] ASC, [StartsAt] ASC, [EndsAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Promotions_ProductID_idx] ON [dbo].[Promotions]([ProductID] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SupportTickets_UserID_CreatedAt_idx] ON [dbo].[SupportTickets]([UserID] ASC, [CreatedAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserCartItems_ProductID_idx] ON [dbo].[UserCartItems]([ProductID] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserSessions_ExpiresAt_idx] ON [dbo].[UserSessions]([ExpiresAt] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserSessions_UserID_idx] ON [dbo].[UserSessions]([UserID] ASC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserWishlistItems_ProductID_idx] ON [dbo].[UserWishlistItems]([ProductID] ASC);

-- AddForeignKey
ALTER TABLE [dbo].[CommunityComments] ADD CONSTRAINT [CommunityComments_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[CommunityPosts]([PostID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommunityComments] ADD CONSTRAINT [CommunityComments_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommunityPostLikes] ADD CONSTRAINT [CommunityPostLikes_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[CommunityPosts]([PostID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommunityPostLikes] ADD CONSTRAINT [CommunityPostLikes_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommunityPosts] ADD CONSTRAINT [CommunityPosts_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [Notifications_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [FK__OrderItem__Order__300424B4] FOREIGN KEY ([OrderID]) REFERENCES [dbo].[Orders]([OrderID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [FK__OrderItem__Produ__30F848ED] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Products]([ProductID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [FK__Orders__UserID__2D27B809] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [FK_Products_Brands] FOREIGN KEY ([BrandID]) REFERENCES [dbo].[Brands]([BrandID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Promotions] ADD CONSTRAINT [Promotions_ProductID_fkey] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Products]([ProductID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SupportTickets] ADD CONSTRAINT [SupportTickets_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserCartItems] ADD CONSTRAINT [UserCartItems_ProductID_fkey] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Products]([ProductID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserCartItems] ADD CONSTRAINT [UserCartItems_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserProfiles] ADD CONSTRAINT [UserProfiles_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserSessions] ADD CONSTRAINT [UserSessions_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserWishlistItems] ADD CONSTRAINT [UserWishlistItems_ProductID_fkey] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Products]([ProductID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserWishlistItems] ADD CONSTRAINT [UserWishlistItems_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
