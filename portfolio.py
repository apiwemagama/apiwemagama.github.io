import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import cv2
import pyautogui
import numpy as np

# Global configuration
SCREEN_SIZE = pyautogui.size()
FPS = 30
VIDEO_NAME = "Portfolio.mp4"
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(VIDEO_NAME, fourcc, FPS, SCREEN_SIZE)

def capture_frame():
    """Capture and write a single frame to video without any overlay text"""
    img = pyautogui.screenshot()
    frame = np.array(img)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    out.write(frame)
    time.sleep(1/FPS)

def perform_action(action_func=None, duration_seconds=1):
    """
    Perform an action while capturing synchronized frames
    Args:
        action_func: Function to execute on first frame (None for just waiting)
        duration_seconds: Total duration for this action segment
    """
    frames_needed = int(FPS * duration_seconds)
    for frame_num in range(frames_needed):
        # Execute action only on first frame
        if frame_num == 0 and action_func is not None:
            try:
                action_func()
                print(f"Action completed successfully: {action_func.__name__}")
            except Exception as e:
                print(f"Action error in {action_func.__name__}: {e}")
        
        # Capture clean frame without any text overlay
        capture_frame()

# Chrome setup
chrome_options = Options()
chrome_options.add_argument("--start-fullscreen")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option("useAutomationExtension", False)

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
wait = WebDriverWait(driver, 10)

try:
    # Initial page load
    def load_website():
        driver.get("https://apiwemagama.github.io")
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    
    perform_action(load_website, 6)
    
    # Hide scrollbar
    driver.execute_script("""
        var style = document.createElement('style');
        style.innerHTML = '::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);
    """)
    
    # Close modal
    def close_modal():
        close_button = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "btn-close")))
        close_button.click()
    perform_action(close_modal, 5)
    
    # Navigate to About
    def click_about():
        about_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "About")))
        about_link.click()
    perform_action(click_about, 5)
    
    # Navigate to Skills
    def click_skills():
        skills_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Skills")))
        skills_link.click()
    perform_action(click_skills, 5)
    
    # Navigate to Projects
    def click_projects():
        projects_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Projects")))
        projects_link.click()
    perform_action(click_projects, 5)
    
    # Navigate to Beyond Code
    def click_beyond_code():
        beyond_code_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Beyond Code")))
        beyond_code_link.click()
    perform_action(click_beyond_code, 5)
    
    # Click Soundtrack tab
    def click_soundtrack_tab():
        soundtrack_tab_button = wait.until(EC.element_to_be_clickable((By.ID, "soundtrack-tab")))
        soundtrack_tab_button.click()
    perform_action(click_soundtrack_tab, 4)
    
    # Verify Soundtrack content
    def verify_soundtrack():
        soundtrack_content = wait.until(EC.presence_of_element_located((By.ID, "soundtrack")))
    perform_action(verify_soundtrack, 1)
    
    # Navigate to Contact
    def click_contact():
        contact_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Contact")))
        contact_link.click()
    perform_action(click_contact, 5)
    
    # Final delay to show last page
    perform_action(None, 3)

finally:
    # Cleanup
    out.release()
    driver.quit()
    print(f"\nScreen recording saved to: {VIDEO_NAME}")