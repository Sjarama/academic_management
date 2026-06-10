from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time

BASE_URL = "http://localhost:5501"

SERVICES = [
    {
        "key": "usuario",
        "display": "Estudiantes",
        "fields": ["firstName", "lastName", "email", "phone", "address"]
    },
    {
        "key": "curso",
        "display": "Cursos",
        "fields": ["name", "description", "teacherId", "credits"]
    },
    {
        "key": "profesor",
        "display": "Profesores",
        "fields": ["firstName", "lastName", "email", "phone"]
    },
    {
        "key": "pago",
        "display": "Pagos",
        "fields": ["studentId", "amount", "status", "dueDate"]
    },
    {
        "key": "notificacion",
        "display": "Notificaciones",
        "fields": ["recipient", "message", "type"]
    }
]


def start_driver():
    opts = Options()
    opts.headless = True
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=opts)
    driver.set_window_size(1200, 900)
    return driver


def wait_for_message(driver, timeout=8):
    end = time.time() + timeout
    while time.time() < end:
        try:
            msg = driver.find_element(By.ID, 'messageBox').text
            if msg and msg.strip():
                return msg.strip()
        except NoSuchElementException:
            pass
        time.sleep(0.2)
    raise TimeoutException('Timeout waiting for messageBox text')


def find_card_by_text(driver, text, timeout=6):
    end = time.time() + timeout
    xpath = f"//div[@id='listContainer']//article[contains(., \"{text}\")]"
    while time.time() < end:
        try:
            el = driver.find_element(By.XPATH, xpath)
            return el
        except NoSuchElementException:
            time.sleep(0.2)
    return None


def fill_field(driver, name, value):
    try:
        el = driver.find_element(By.ID, name)
        tag = el.tag_name.lower()
        if tag == 'select':
            for option in el.find_elements(By.TAG_NAME, 'option'):
                if option.get_attribute('value') == value or option.text == value:
                    option.click()
                    return
            # fallback: pick first non-empty
            opts = [o for o in el.find_elements(By.TAG_NAME, 'option') if o.get_attribute('value')]
            if opts:
                opts[0].click()
        else:
            el.clear()
            el.send_keys(value)
    except NoSuchElementException:
        pass


def run_tests():
    driver = start_driver()
    driver.get(BASE_URL)
    time.sleep(1)

    for svc in SERVICES:
        print(f"Testing service {svc['display']}")
        # select service
        select = driver.find_element(By.ID, 'serviceSelect')
        for option in select.find_elements(By.TAG_NAME, 'option'):
            if option.get_attribute('value') == svc['key']:
                option.click()
                break
        time.sleep(0.6)

        for i in range(1, 4):
            uniq = f"test-{svc['key']}-{int(time.time())}-{i}"
            # create data
            for f in svc['fields']:
                value = ''
                if 'name' in f.lower():
                    value = f"{uniq}-name"
                elif 'first' in f.lower():
                    value = f"{uniq}-f"
                elif 'last' in f.lower():
                    value = f"{uniq}-l"
                elif 'email' in f.lower():
                    value = f"{uniq}@example.com"
                elif 'phone' in f.lower():
                    value = "+56900000000"
                elif 'address' in f.lower():
                    value = "Calle 123"
                elif 'description' in f.lower():
                    value = "Descripcion de prueba"
                elif 'teacherid' in f.lower() or 'studentid' in f.lower():
                    value = "1"
                elif 'credits' in f.lower():
                    value = "3"
                elif 'amount' in f.lower():
                    value = "35000"
                elif 'status' in f.lower():
                    value = "Pendiente"
                elif 'duedate' in f.lower():
                    value = "2026-12-31"
                elif 'message' in f.lower():
                    value = "Mensaje de prueba"
                elif 'type' in f.lower():
                    value = "info"
                else:
                    value = uniq
                fill_field(driver, f, value)

            # submit
            submit = driver.find_element(By.CSS_SELECTOR, 'form#entityForm button[type="submit"]')
            submit.click()
            try:
                msg = wait_for_message(driver, timeout=8)
                print('Create message:', msg)
            except TimeoutException:
                print('No create confirmation message')

            # verify created appears in list
            card = find_card_by_text(driver, uniq, timeout=6)
            if not card:
                print('Created item not found in list for', svc['key'])
            else:
                print('Created item found')

            # edit: click Edit button inside card
            try:
                edit_btn = card.find_element(By.XPATH, ".//button[contains(text(),'Editar')]")
                edit_btn.click()
                time.sleep(0.4)
                # change first text field
                fld = svc['fields'][0]
                newval = uniq + '-edited'
                fill_field(driver, fld, newval)
                submit.click()
                time.sleep(0.6)
                try:
                    msg = wait_for_message(driver, timeout=6)
                    print('Edit message:', msg)
                except TimeoutException:
                    print('No edit confirmation')
            except Exception as e:
                print('Edit failed:', e)

            # delete: find card again and click Eliminar
            time.sleep(0.6)
            card2 = find_card_by_text(driver, uniq, timeout=6)
            if card2:
                try:
                    del_btn = card2.find_element(By.XPATH, ".//button[contains(text(),'Eliminar')]")
                    del_btn.click()
                    # accept confirm
                    alert = driver.switch_to.alert
                    alert.accept()
                    try:
                        msg = wait_for_message(driver, timeout=6)
                        print('Delete message:', msg)
                    except TimeoutException:
                        print('No delete confirmation')
                except Exception as e:
                    print('Delete failed:', e)
            else:
                print('Card not found for delete')

            time.sleep(0.6)

    driver.quit()


if __name__ == '__main__':
    run_tests()
