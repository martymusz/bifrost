import pandas as pd
import hashlib


def init_load_view(source_engine, source_sql, target_engine, target_table):
    df = pd.read_sql_query(source_sql, source_engine)
    # Viewnál mindig init load van, mehet a replace később is elég ezt az eljárást használni a töltésnél
    df.to_sql(name=target_table, con=target_engine, if_exists='replace', index=False, chunksize=10000)


def init_load_dim(source_engine, source_sql, target_engine, target_table):
    df = pd.read_sql_query(source_sql, source_engine)
    df.drop_duplicates()
    # Egyedi kulcs minden dimenzió rekordhoz, később lehet használni a változásvizsgálatnál -> összes oszlop concat
    # és hash convert
    df['checksum'] = df.apply(lambda x: ''.join(x.astype(str)), axis=1).apply(
        lambda x: hashlib.md5(x.encode()).hexdigest())
    df['start_date'] = pd.Timestamp.now().floor('s')
    df['end_date'] = pd.Timestamp('2999-12-31')
    df['current_flg'] = 'Y'
    # Ha menet közben bármelyik insert sikertelen, automatikusan rollbackelve lesz, nem kell külön lekezelni.
    df.to_sql(name=target_table, con=target_engine, if_exists='replace', chunksize=10000, index=False)


def init_load_fact(source_engine, source_sql, target_engine, target_table):
    df = pd.read_sql_query(source_sql, source_engine)
    df['creation_date'] = pd.Timestamp.now().floor('s')
    # Ha menet közben bármelyik insert sikertelen, automatikusan rollbackelve lesz, nem kell külön lekezelni.
    df.to_sql(name=target_table, con=target_engine, if_exists='replace', chunksize=10000, index=False)
