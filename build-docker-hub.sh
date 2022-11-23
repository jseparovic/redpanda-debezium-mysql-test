#!/bin/bash -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

REPO=jseparovic
PROJECT=redpanda-debezium-mysql-test
VERSION=0.1.0
dockerfile=Dockerfile

if [ "$1" == "-r" ]
then
  ARGS=--no-cache
fi

function build {
  project=$1
  DOCKER_BUILDKIT=1 docker build ${ARGS} -t ${project} -f ${dockerfile} . || exit 1
  docker tag ${project} ${REPO}/${project}:${VERSION} || exit 1
  docker tag ${project} ${REPO}/${project}:latest || exit 1
  docker push ${REPO}/${project}:${VERSION} || exit 1
  docker push ${REPO}/${project}:latest || exit 1
}


build $PROJECT
