import sys
import os
import logger
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.config import CONFIG

logger.setup_logging()

class Main:
    def orchestrate(self):
        
        print("HELLO WORLD") # start

if __name__ == "__main__":
    main_instance = Main()
    main_instance.orchestrate()