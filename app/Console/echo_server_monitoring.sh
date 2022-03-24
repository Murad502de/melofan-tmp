#!/bin/bash

ret=$(ps aux | grep '[/]opt/cpanel/ea-php72/root/usr/bin/php /home/xetrade/public_html/artisan websockets:serve --port=8443 --host=51.254.28.224' | wc -l)

if [ "$ret" -eq 0 ]; then

    sleep 1
	cd /home/xetrade/public_html/

	/opt/cpanel/ea-php72/root/usr/bin/php /home/xetrade/public_html/artisan websockets:serve --port=8443 --host=51.254.28.224 >> /home/xetrade/public_html/storage/logs/echo_server.log

	echo "Запуск сервера сокетов на порту 8443 и хосте 51.254.28.224" >> /home/xetrade/public_html/storage/logs/echo_server.log

	exit 1

else
	exit 1
fi;
