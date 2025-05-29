import { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export interface ExcelRowData {
  data_fiscal: string;
  nome_pdv: string;
  nome_item: string;
  quantidade: number;
  valor_produto: number;
  desconto: number;
  tx_servico: number;
  valor_total: number;
  atendente: string;
  grupo_fixo: string;
  grupo: string;
}

export const useExcelUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadExcel = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Ler o arquivo Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Dados extraídos do Excel:', jsonData);
      console.log('Primeiras 3 linhas:', jsonData.slice(0, 3));

      // Mapear os dados para o formato do banco com validação melhorada
      const salesData = jsonData.map((row: any, index: number) => {
        // Tentar diferentes variações do nome da coluna PDV
        const nome_pdv = row['Nome PDV'] || 
                         row['Nome PDV Lançamento'] || 
                         row['nome_pdv'] || 
                         row['nome_pdv_lancamento'] || 
                         row['PDV'] ||
                         row['Ponto de Venda'] ||
                         '';

        console.log(`Linha ${index + 1} - nome_pdv encontrado:`, nome_pdv);

        return {
          data_fiscal: row['Data Fiscal'] || row['data_fiscal'] || '',
          nome_pdv: nome_pdv,
          nome_item: row['Nome Item'] || row['nome_item'] || '',
          quantidade: parseFloat(row['Quantidade'] || row['quantidade'] || 0),
          valor_produto: parseFloat(row['Valor Produto'] || row['valor_produto'] || 0),
          desconto: parseFloat(row['Desconto'] || row['desconto'] || 0),
          tx_servico: parseFloat(row['Taxa Serviço'] || row['tx_servico'] || 0),
          valor_total: parseFloat(row['Valor Total'] || row['valor_total'] || 0),
          atendente: row['Atendente'] || row['atendente'] || '',
          grupo_fixo: row['Grupo Fixo'] || row['grupo_fixo'] || '',
          grupo: row['Grupo'] || row['grupo'] || ''
        };
      });

      console.log('Dados processados:', salesData.slice(0, 3));

      // Validar dados obrigatórios e filtrar registros inválidos
      const validSalesData = salesData.filter((item, index) => {
        const isValid = item.nome_pdv && item.nome_pdv.trim() !== '';
        
        if (!isValid) {
          console.warn(`Linha ${index + 1} ignorada - nome_pdv está vazio:`, item);
        }
        
        return isValid;
      });

      console.log(`Total de registros: ${salesData.length}`);
      console.log(`Registros válidos: ${validSalesData.length}`);
      console.log(`Registros ignorados: ${salesData.length - validSalesData.length}`);

      if (validSalesData.length === 0) {
        throw new Error('Nenhum registro válido encontrado. Verifique se a coluna "Nome PDV" está presente e preenchida na planilha.');
      }

      // Verificar registros existentes para evitar duplicatas
      const existingRecordsCheck = await Promise.all(
        validSalesData.map(async (item) => {
          const { data, error } = await supabase
            .from('SalesData')
            .select('id')
            .eq('data_fiscal', item.data_fiscal)
            .eq('nome_pdv', item.nome_pdv)
            .eq('nome_item', item.nome_item)
            .eq('valor_total', item.valor_total);

          if (error) {
            console.error('Erro ao verificar duplicata:', error);
            return false;
          }

          return data && data.length > 0;
        })
      );

      // Filtrar apenas os registros que não existem
      const newRecords = validSalesData.filter((_, index) => !existingRecordsCheck[index]);

      if (newRecords.length === 0) {
        toast({
          title: "Aviso",
          description: "Todos os registros desta planilha já foram importados anteriormente.",
        });
        return;
      }

      // Inserir apenas os novos registros
      const { data: insertedData, error: insertError } = await supabase
        .from('SalesData')
        .insert(newRecords);

      if (insertError) {
        console.error('Erro detalhado na inserção:', insertError);
        throw insertError;
      }

      console.log('Dados inseridos com sucesso:', insertedData);

      // Invalidar queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['salesData'] });
      await queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      await queryClient.invalidateQueries({ queryKey: ['salesDataCount'] });

      toast({
        title: "Upload realizado com sucesso!",
        description: `${newRecords.length} novos registros foram importados. ${validSalesData.length - newRecords.length} registros foram ignorados por já existirem.`,
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      
      let errorMessage = "Houve um problema ao processar o arquivo Excel.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadExcel, isUploading };
};
