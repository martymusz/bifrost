from app.models import db


class Metamodel(db.Model):
    __tablename__ = 'metamodels'
    __table_args__ = {'schema': 'bifrost'}

    sequence = db.Sequence('seq_metamodel', schema='bifrost')

    metamodel_id = db.Column(db.Integer, sequence, primary_key=True, index=True)
    metamodel_name = db.Column(db.String(64), primary_key=True, index=True)
    metamodel_schema = db.Column(db.String(64))
    target_connection_id = db.Column(db.Integer, nullable=False)
    target_connection_name = db.Column(db.String(20))
    tables = db.Column(db.String(1000))
    creation_timestamp = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'metamodel_id': self.metamodel_id,
            'metamodel_name': self.metamodel_name,
            'metamodel_schema': self.metamodel_schema,
            'target_connection_id': self.target_connection_id,
            'target_connection_name': self.target_connection_name,
            'tables': self.tables
        }

    @staticmethod
    def add_new_metamodel(metamodel_name, metamodel_schema, target_connection_id, target_connection_name, creation_timestamp):
        new_metamodel = Metamodel(metamodel_name=metamodel_name, metamodel_schema=metamodel_schema,
                                  target_connection_id=target_connection_id,
                                  target_connection_name=target_connection_name,
                                  creation_timestamp=creation_timestamp)
        return new_metamodel

    def add_new_table(self, table_name):
        if self.tables == '':
            self.tables = table_name
        else:
            self.tables = self.tables + ', ' + table_name
        return self

    @staticmethod
    def get_all_metamodels():
        metamodels = Metamodel.query.all()
        return metamodels

    @staticmethod
    def get_by_id(metamodel_id):
        metamodel = Metamodel.query.filter_by(metamodel_id=metamodel_id)[0]
        return metamodel

    @staticmethod
    def get_by_name(metamodel_name):
        metamodel = Metamodel.query.filter_by(metamodel_name=metamodel_name)[0]
        return metamodel

    def update(self, metamodel_name):
        self.metamodel_name = metamodel_name
        return self
