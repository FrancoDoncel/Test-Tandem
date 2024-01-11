BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [idUsuario] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [nombreUsuario] NVARCHAR(1000) NOT NULL,
    [apellidoUsuario] NVARCHAR(1000) NOT NULL,
    [emailUsuario] NVARCHAR(1000) NOT NULL,
    [telefonoUsuario] NVARCHAR(1000) NOT NULL,
    [passwordUsuario] NVARCHAR(1000) NOT NULL CONSTRAINT [Usuario_passwordUsuario_df] DEFAULT '123456',
    [deleted] BIT NOT NULL CONSTRAINT [Usuario_deleted_df] DEFAULT 0,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([idUsuario]),
    CONSTRAINT [Usuario_emailUsuario_key] UNIQUE NONCLUSTERED ([emailUsuario])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
