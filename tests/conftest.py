import pytest
from run import app


@pytest.fixture(scope='module')
def client():
    client = app.test_client()
    return client



