from app.models import db


class Connection(db.Model):
    __tablename__ = 'connections'
    __table_args__ = {'schema': 'bifrost'}

    connection_id = db.Column(db.Integer, db.Sequence('seq_connection'), primary_key=True, index=True)
    bind_key = db.Column(db.String(64))
    database_uri = db.Column(db.String(512))
    database_name = db.Column(db.String(64))
    default_schema = db.Column(db.String(64))
    driver_name = db.Column(db.String(64))
    track_modifications = db.Column(db.Boolean)

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
                                    default_schema=default_schema, driver_name=driver_name,
                                    track_modifications=False)
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
