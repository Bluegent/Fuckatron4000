@echo off
SET CHECK_FILE=%1\%2
SET COMMAND_TO_RUN=%3

echo "file:" %CHECK_FILE%
echo "command:" %COMMAND_TO_RUN%

:loop_start
if exist %CHECK_FILE% (
    del %CHECK_FILE%
    %COMMAND_TO_RUN%
) else (
    echo "file not found."
)
timeout /t 10
goto loop_start
