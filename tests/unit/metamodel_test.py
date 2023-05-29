from app.models import Metamodel
from datetime import datetime


def test_new_metamodel():
    metamodel = Metamodel.add_new_metamodel(metamodel_name='metamodel_name', metamodel_schema='metamodel_schema',
                                            target_connection_id=1, target_connection_name='target_connection_name',
                                            creation_timestamp=datetime.now())
    assert metamodel.metamodel_id != ''
    assert metamodel.metamodel_name == 'metamodel_name'
    assert metamodel.metamodel_schema == 'metamodel_schema'
    assert metamodel.target_connection_id == 1


