@echo Set objShell = CreateObject("Shell.Application") > %temp%\sudo.tmp.vbs
@echo args = Right(%*, (Len(%*) - Len(%1))) >> %temp%\sudo.tmp.vbs
@echo objShell.ShellExecute %1, args, "", "runas" >> %temp%\sudo.tmp.vbs
@cscript %temp%\sudo.tmp.vbs
