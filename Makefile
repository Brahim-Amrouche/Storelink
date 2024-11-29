COMPOSE_FILE = ./containers/docker-compose.yml
ENV_PATH = .env

all:
	docker-compose -f ${COMPOSE_FILE} --env-file ${ENV_PATH} up -d

down:
	docker-compose -f ${COMPOSE_FILE} --env-file ${ENV_PATH} down 

clean :
	-docker-compose -f ${COMPOSE_FILE} --env-file ${ENV_PATH} down --rmi all 

re : down all

purge: clean all
