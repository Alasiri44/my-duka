phone_number = '0757952522'
cleaned_number = ''.join(filter(str.isdigit, phone_number))
formatted_phone = f"254{cleaned_number[-9:]}"
print(formatted_phone)