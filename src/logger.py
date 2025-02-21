import logging
import os
from config import CONFIG
import sys

def setup_logging():
    log_level_terminal = logging.INFO
    log_level_file = logging.DEBUG

    log_file = CONFIG["log_file"]
    if log_file:
        logs_dir = os.path.dirname(log_file)
        os.makedirs(logs_dir, exist_ok=True)

        with open(log_file, 'w'):
            pass

    terminal_handler = logging.StreamHandler(sys.stdout)
    terminal_handler.setLevel(log_level_terminal)
    terminal_formatter = logging.Formatter("%(message)s")
    terminal_handler.setFormatter(terminal_formatter)

    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(log_level_file)
    file_formatter = logging.Formatter("%(asctime)s <> %(levelname)s <> %(message)s")
    file_handler.setFormatter(file_formatter)

    logging.basicConfig(level=logging.DEBUG, handlers = [terminal_handler, file_handler])


class StreamToLog:
    def __init__(self, logger, log_level):
        self.logger = logger
        self.log_level = log_level
    
    def write(self, message):
        if message.strip():
            self.logger.log(self.log_level, message.strip())

    def flush(self): 
        pass

setup_logging()
logger = logging.getLogger(__name__)

stdout_logger = logging.getLogger('STDOUT')
sys.stdout = StreamToLog(stdout_logger, logging.INFO)

stderr_logger = logging.getLogger('STDERR')
sys.stderr = StreamToLog(stderr_logger, logging.ERROR)