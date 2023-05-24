from app.models import db


class Connection(db.Model):
    __tablename__ = 'connections'
    __table_args__ = {'schema': 'bifrost'}

    sequence = db.Sequence('seq_connection', schema='bifrost')

    connection_id = db.Column(db.Integer, sequence, primary_key=True, index=True)
    bind_key = db.Column(db.String(64), unique=True)
    database_uri = db.Column(db.String(512))
    database_name = db.Column(db.String(64))
    default_schema = db.Column(db.String(64))
    driver_name = db.Column(db.String(64))

    def to_dict(self):
        return {
            'connection_id': self.connection_id,
            'bind_key': self.bind_key,
            'database_uri': self.database_uri,
            'database_name': self.database_name,
            'default_schema': self.default_schema,
            'driver_name': self.driver_name
        }

    @staticmethod
    def add_new_connection(bind_key, database_uri, database_name, default_schema, driver_name):
        new_connection = Connection(bind_key=bind_key, database_uri=database_uri, database_name=database_name,
                                    default_schema=default_schema, driver_name=driver_name)
        return new_connection

    @staticmethod
    def get_by_id(connection_id):
        connection = Connection.query.filter_by(connection_id=connection_id)[0]
        return connection

    @staticmethod
    def get_by_key(bind_key):
        connection = Connection.query.filter_by(bind_key=bind_key)[0]
        return connection

    @staticmethod
    def get_all_connections():
        connections = Connection.query.all()
        return connections

    def update(self, bind_key, database_uri, database_name, default_schema, driver_name):
        self.bind_key = bind_key
        self.database_uri = database_uri
        self.database_name = database_name
        self.default_schema = default_schema
        self.driver_name = driver_name
        return self
