"use strict";

exports.getUser = "SELECT * FROM Users;";

exports.spUserRegistration =
  "DECLARE	@success int, @ErrorMessage nvarchar(255); EXEC [dbo].[UserRegistration] :userName, :fullName, :email, :noHp, :address, :password, @success = @success OUTPUT, @ErrorMessage = @ErrorMessage OUTPUT; SELECT @success as success, @ErrorMessage as ErrorMessage;";

exports.spUserLogin =
  "DECLARE	@success int, @ErrorMessage nvarchar(255);  EXEC	[dbo].[UserLogin] @userName = :userName, @password = :password, @success = @success OUTPUT, @ErrorMessage = @ErrorMessage OUTPUT; IF @success = 1 SELECT	@success as success, u.id, u.userName, u.fullName, u.email, u.noHp, u.address, u.isActive, u.deleted FROM [express].[dbo].[Users] U WHERE u.userName = :userName; ELSE SELECT @success as success, @ErrorMessage as ErrorMessage;";
