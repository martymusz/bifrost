import pandas as pd
import hashlib


def load_scd(source_engine, target_engine, dimension_key, source_sql, target_sql, target_table):
    df_source_data = pd.read_sql_query(source_sql, source_engine)
    df_source_data['checksum'] = df_source_data.apply(lambda x: ''.join(x.astype(str)), axis=1).apply(
        lambda x: hashlib.md5(x.encode()).hexdigest())
    df_target_data = pd.read_sql_query(target_sql, target_engine)

    # Kulcs alapján mergelem a két dataframet
    # Minden új és megváltozott rekodra kell egy insert
    merged_data = pd.merge(df_target_data[[dimension_key, 'checksum']], df_source_data, on=dimension_key, how='right',
                           suffixes=('_trg', ''))
    df_insert = pd.DataFrame(merged_data.loc[merged_data['checksum_trg'] != merged_data['checksum']])
    df_insert.drop(columns=['checksum_trg'], inplace=True)
    df_insert['start_date'] = pd.Timestamp.now().floor('s')
    df_insert['end_date'] = pd.Timestamp('2999-12-31')
    df_insert['current_flg'] = 'Y'
    del merged_data

    # Ahol változás volt ott deaktiválni kell a "régi" sorokat
    df_target_data = pd.merge(df_target_data, df_source_data[[dimension_key, 'checksum']], on=dimension_key, how='left',
                              suffixes=('', '_src'))
    df_target_data['current_flg'] = df_target_data.apply(
        lambda dim: 'N' if (dim['checksum'] != dim['checksum_src']) else dim['current_flg'], axis=1)
    df_target_data['end_date'] = df_target_data.apply(
        lambda dim: pd.Timestamp.now().floor('s') if(dim['checksum'] != dim['checksum_src']) else dim['end_date'], axis=1)
    df_target_data.drop(columns=['checksum_src'], inplace=True)

    final_table = pd.concat([df_target_data, df_insert], axis=0)

    # Ha menet közben bármelyik insert sikertelen, automatikusan rollbackelve lesz, nem kell külön lekezelni.
    final_table.to_sql(name=target_table, con=target_engine, if_exists='replace', chunksize=10000, index=False)
