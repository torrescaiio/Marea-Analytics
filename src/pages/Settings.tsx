import { Settings as SettingsIcon, DollarSign, Users, Database, Bell, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-ocean-100 rounded-lg flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-ocean-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do sistema</p>
          </div>
        </div>

        {/* Configurações Gerais */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-ocean-50 rounded-lg">
                <Bell className="h-4 w-4 text-ocean-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Configurações Gerais</CardTitle>
                <CardDescription>Configure as opções básicas do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações</Label>
                <p className="text-sm text-gray-500">Receber alertas sobre vendas e metas</p>
              </div>
              <Switch className="data-[state=checked]:bg-ocean-600" />
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo Escuro</Label>
                <p className="text-sm text-gray-500">Alternar entre tema claro e escuro</p>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-ocean-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Vendas */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-ocean-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-ocean-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Configurações de Vendas</CardTitle>
                <CardDescription>Defina parâmetros para análise de vendas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-base">Meta Diária por Garçom (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                  <Input 
                    type="number" 
                    placeholder="2000" 
                    className="pl-10 bg-white border-gray-200 focus:border-ocean-600 focus:ring-ocean-600" 
                  />
                </div>
                <p className="text-sm text-gray-500">Meta individual para avaliação de performance</p>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Meta Mensal de Vendas (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                  <Input 
                    type="number" 
                    placeholder="60000" 
                    className="pl-10 bg-white border-gray-200 focus:border-ocean-600 focus:ring-ocean-600" 
                  />
                </div>
                <p className="text-sm text-gray-500">Meta global do estabelecimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Backup */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-ocean-50 rounded-lg">
                <Database className="h-4 w-4 text-ocean-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Configurações de Backup</CardTitle>
                <CardDescription>Configure as opções de backup automático</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Backup Automático</Label>
                <p className="text-sm text-gray-500">Realizar backup diário dos dados</p>
              </div>
              <Switch className="data-[state=checked]:bg-ocean-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Horário do Backup</Label>
              <Input 
                type="time" 
                defaultValue="23:00" 
                className="bg-white border-gray-200 focus:border-ocean-600 focus:ring-ocean-600" 
              />
              <p className="text-sm text-gray-500">Horário em que o backup será realizado automaticamente</p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Usuários */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-ocean-50 rounded-lg">
                <Users className="h-4 w-4 text-ocean-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Configurações de Usuários</CardTitle>
                <CardDescription>Gerencie as configurações de usuários do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Permitir Novos Cadastros</Label>
                <p className="text-sm text-gray-500">Habilitar registro de novos garçons</p>
              </div>
              <Switch className="data-[state=checked]:bg-ocean-600" />
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Autenticação em Dois Fatores</Label>
                <p className="text-sm text-gray-500">Exigir verificação adicional no login</p>
              </div>
              <Switch className="data-[state=checked]:bg-ocean-600" />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Cancelar
          </Button>
          <Button className="bg-ocean-600 hover:bg-ocean-700 text-white">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 