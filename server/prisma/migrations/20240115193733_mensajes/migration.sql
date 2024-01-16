BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[MensajesChat] (
    [idMensajeChat] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [MensajesChat_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [mensajeChat] NVARCHAR(1000) NOT NULL,
    [deleted] BIT NOT NULL CONSTRAINT [MensajesChat_deleted_df] DEFAULT 0,
    [idUsuario] INT NOT NULL,
    CONSTRAINT [MensajesChat_pkey] PRIMARY KEY CLUSTERED ([idMensajeChat])
);

-- AddForeignKey
ALTER TABLE [dbo].[MensajesChat] ADD CONSTRAINT [MensajesChat_idUsuario_fkey] FOREIGN KEY ([idUsuario]) REFERENCES [dbo].[Usuario]([idUsuario]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
