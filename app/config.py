
SECRET_KEY = "GDtfD^&$%@^8tgYjD"

SQLALCHEMY_DATABASE_URI = 'postgresql://voxalhor:ShNAjKeXdaKF7UKid3pmBAx17Fwtyv-c@mel.db.elephantsql.com/voxalhor'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DEFAULT_SCHEMA = 'bifrost'

SQLALCHEMY_BINDS = {
    'sales': 'postgresql://qabhuzsw:Q2dT8UyL04HM-YJwH39EvqoUGJ_7BJnw@horton.db.elephantsql.com/qabhuzsw',
    'finance': 'postgresql://vekohjgn:Z98Qrrr7HFWLnvGLfbGPQs4IAYOlWGhC@horton.db.elephantsql.com/vekohjgn',
}