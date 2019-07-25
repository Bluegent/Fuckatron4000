@echo off
SET CHECK_FILE=%cd%\%1
SET COMMAND_TO_RUN=%3
SET FOLDER=%2
SET ORIG_FOLER=%~dp0
echo file: %CHECK_FILE%
echo command: %COMMAND_TO_RUN%
echo folder: %FOLDER%


:loop_start
cd %FOLDER%
if exist %CHECK_FILE% (
    del %CHECK_FILE%
    call %COMMAND_TO_RUN%
) else (
    echo File not found.
)
cd %ORIG_FOLER%
timeout /nobreak 10

goto loop_start
