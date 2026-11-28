CREATE TABLE [dbo].[LootBoxClaims] (
    [ClaimID] INT IDENTITY(1,1) NOT NULL,
    [UserID] INT NOT NULL,
    [RewardKey] NVARCHAR(50) NOT NULL,
    [DrawDate] DATE NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_LootBoxClaims_CreatedAt] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_LootBoxClaims] PRIMARY KEY CLUSTERED ([ClaimID]),
    CONSTRAINT [FK_LootBoxClaims_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [UQ_LootBoxClaims_UserID_DrawDate]
    ON [dbo].[LootBoxClaims]([UserID], [DrawDate]);

CREATE INDEX [IX_LootBoxClaims_UserID_CreatedAt]
    ON [dbo].[LootBoxClaims]([UserID], [CreatedAt]);
